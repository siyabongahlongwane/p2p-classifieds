const { logger } = require('firebase-functions');
const { generateRequestHash, logAndSendError, transformOrderNumber, customError } = require('../utils/payments');
const { models: { Order, OrderItem, Product, User, ProductPhoto, Wallet, Cart } } = require('../db_models');

const db = require('../db_models');
const { default: axios } = require('axios');
const mail = require('../utils/mail');
const { sendEmailsToBuyerAndSeller } = require('./ozowController');

const triggerOzowPayment = (requestBody, res) => {
    axios.post("https://api.ozow.com/PostPaymentRequest", requestBody, {
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json',
            "ApiKey": process.env.OZOW_API_KEY
        }
    })
        .then(response => {
            if (!response?.['data']?.url) throw customError(response.errorMessage || 'Error launching payment gateway', 400);
            res.send({ payload: response['data'] });
        }).catch(({ message, status = 400 }) => {
            logAndSendError(res, message, status);
        });
}

const handleNoGatewayOrder = async (order, res) => {
    const { order_id } = order;
    logger.info('No gateway order', order);
    try {
        const order = await Order.findByPk(+order_id, {
            include: {
                model: OrderItem,
                as: 'items',
                include: {
                    model: Product,
                    as: 'product',
                },
            },
        });


        await order.update({ isPaid: true, datePaid: new Date(), status: 'Paid' });

        // Bulk update the status of the products to 'Sold'
        const productIds = order.items.map(item => item.product_id);
        for (const id of productIds) {
            await Product.update({ status: 'Sold' }, { where: { product_id: id } });
        }

        // Bulk removal of the sold cart items
        await Cart.destroy({ where: { user_id: +order.user_id } });

        sendEmailsToBuyerAndSeller(order);

        logger.info('Order updated successfully', order);
        res.status(200).send({ payload: { msg: 'Order paid successfully' } });

    } catch (error) {
        logger.error('Error updating order', error);
        return res.status(500).send('Error updating order');
    }
}

const returnProductsToStore = async (order, res) => {
    // Bulk update the status of the products to 'Sold'
    await Product.update(
        { status: 'Available' },
        { where: { product_id: order.items.map(item => item.product_id) } }
    );

    const buyerWallet = await Wallet.findOne({ where: { user_id: order.user_id } });
    await buyerWallet.increment('amount', { by: order.total_price });

    logger.info('Order cancelled successfully', order.order_id);
}

module.exports = {

    createOrder: async (req, res) => {
        const { user_id, cart, cartTotal, total, deliveryCost, shippingMethod, paymentOption, phoneNumber, province, pudoLockerLocation, customerDetails } = req.body;
        const { paymentOption: selectedPaymentOption, gateway } = req.query;

        const transaction = await db.sequelize.transaction();

        try {
            // Create the order
            const order = await Order.create({
                user_id,
                shop_id: cart[0].shop_id,
                delivery_cost: deliveryCost,
                shipping_method: shippingMethod,
                payment_option: paymentOption,
                phone_number: phoneNumber,
                province,
                pudo_locker_location: pudoLockerLocation,
                total_price: total,
                non_discounted_price: total,
                seller_gain: cart.reduce((acc, curr) => +acc + +curr.seller_gain, 0).toFixed(2)
            }, { transaction });

            // Create order items
            const orderItems = cart.map(item => ({
                order_id: order.order_id,
                product_id: item.product_id,
                price: item.price,
            }));

            await OrderItem.bulkCreate(orderItems, { transaction });

            logger.info('New Classifieds Order ', order);

            switch (selectedPaymentOption) {
                case 'walletFull':
                    const currentWalletAmount = await Wallet.findOne({ where: { user_id } });
                    logger.info('New Wallet Full Order');
                    if (currentWalletAmount?.dataValues?.amount < order?.dataValues?.total_price) {
                        logger.error('Insufficient funds in wallet');
                        await transaction.rollback();
                        return res.status(400).json({ error: 'Insufficient funds in wallet' });
                    }

                    try {

                        await Wallet.update({ amount: '0.00' }, { where: { user_id } });
                        await transaction.commit();
                        await handleNoGatewayOrder(order?.dataValues, res);
                    } catch (error) {
                        logger.error('Error processing walletFull order:', error);
                        res.status(500).json({ error: 'Failed to process wallet full order' });
                    }
                    break;


                case 'walletPartial':
                    logger.info('New Wallet Partial Order');

                    try {
                        const partialWallet = await Wallet.findOne({ where: { user_id } });
                        const remainingAmount = order?.dataValues?.total_price - partialWallet?.dataValues?.amount;

                        await Wallet.update({ amount: '0.00' }, { where: { user_id } });

                        const partialRequestBody = await generateRequestHash(
                            { ...order?.dataValues, customerDetails, total_price: remainingAmount },
                            order.order_id.toString()
                        );

                        await transaction.commit();
                        triggerOzowPayment(partialRequestBody, res);
                    } catch (error) {
                        await transaction.rollback();
                        logger.error('Error processing partial wallet order:', error);
                        res.status(500).json({ error: 'Failed to process partial wallet order' });

                    }

                    break;

                case 'walletExcess':
                    logger.info('New Wallet Excess Order');
                    try {
                        const excessWallet = await Wallet.findOne({ where: { user_id } });
                        if (excessWallet?.dataValues?.amount < order?.dataValues?.total_price) {
                            logger.error('Insufficient funds in wallet');
                            await transaction.rollback();
                            return res.status(400).json({ error: 'Insufficient funds in wallet' });
                        }
                        await Wallet.update({ amount: (excessWallet?.dataValues?.amount - order?.dataValues?.total_price).toFixed(2) }, { where: { user_id } });

                        await transaction.commit();
                        await handleNoGatewayOrder(order?.dataValues, res);
                    } catch (error) {
                        await transaction.rollback();
                        logger.error('Error processing partial wallet order:', error);
                        res.status(500).json({ error: 'Failed to process wallet order' });
                    }

                    break;

                default:
                    logger.info('Default Gateway Order');
                    const requestBody = await generateRequestHash(
                        { ...order?.dataValues, customerDetails },
                        order.order_id.toString()
                    );

                    console.log({ requestBody })
                    await transaction.commit();
                    triggerOzowPayment(requestBody, res);
                    break;
            }
        } catch (error) {
            // Rollback the transaction
            await transaction.rollback();
            res.status(500).json({ err: 'Failed to create order', error: error.message });
        }
    },

    fetchOrdersWithItems: async (req, res) => {

        try {
            const { query } = req;
            const orders = await Order.findAll({
                where: { ...query },
                include: [{
                    model: OrderItem,
                    as: 'items',
                    include: {
                        model: Product,
                        as: 'product',
                        include: {
                            model: ProductPhoto,
                            as: 'photos',
                        },
                    },
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email', 'phone']
                }
                ],
                order: [['created_at', 'DESC']]
            });

            res.send({ payload: orders });
        } catch (error) {
            res.status(500).json({ err: 'Failed to fetch orders', error: error.message });

        }
    },

    updateCustomerOrderStatus: async (req, res) => {
        const { order_id, status, updatedBy } = req.body;

        try {
            await Order.update({ status }, { where: { order_id } });


            const { dataValues } = await Order.findOne({
                where: { order_id },
                include: [
                    {
                        model: OrderItem,
                        as: 'items',
                        include: {
                            model: Product,
                            as: 'product', // Fetch product details
                            include: {
                                model: ProductPhoto,
                                as: 'photos', // Fetch product photos
                            },
                        },
                    },
                    {
                        model: User,
                        as: 'user', // Fetch user details
                        attributes: ['first_name', 'last_name', 'email', 'phone'], // Select only the first_name field
                    },
                ],
            });

            const emailData = {
                recipientName: dataValues.user.first_name,
                orderId: order_id,
                updatedBy: updatedBy,
                newStatus: status,
                url: `${process.env.CLIENT_URL}/home`,
                year: new Date().getFullYear()
            }

            if (status === 'Cancelled') {
                emailData.isCancellation = true;
                returnProductsToStore(dataValues, res);
            }

            await mail(dataValues.user.email, 'Order Status Update', 'order-status-update', emailData);

            res.status(200).send({ payload: dataValues, msg: 'Order status updated successfully' });
        } catch (error) {
            res.status(500).json({ err: 'Failed to update order status', error: error.message });
        }
    },
    updateSellerOrderStatus: async (req, res) => {
        const { order_id, shop_id, seller_gain } = req.body;
        try {
            await Order.update({ status: 'Received By Buyer' }, { where: { order_id } });

            const { dataValues } = await User.findOne({
                where: { shop_id }
            });

            const emailData = {
                recipientName: dataValues.first_name,
                orderId: order_id,
                orderAmount: seller_gain,
                url: `${process.env.CLIENT_URL}`,
                payoutUrl: `${process.env.CLIENT_URL}/my-wallet`,
                year: new Date().getFullYear()
            }

            await mail(dataValues.email, 'Your funds are now available in your wallet!', 'order-finalized', emailData);

            const { dataValues: payload } = await Order.findOne({
                where: { order_id },
                include: [
                    {
                        model: OrderItem,
                        as: 'items',
                        include: {
                            model: Product,
                            as: 'product', // Fetch product details
                            include: {
                                model: ProductPhoto,
                                as: 'photos', // Fetch product photos
                            },
                        },
                    },
                    {
                        model: User,
                        as: 'user', // Fetch user details
                        attributes: ['first_name', 'last_name', 'email', 'phone'], // Select only the first_name field
                    },
                ],
            });

            const { dataValues: seller } = await User.findOne({ where: { shop_id } });
            const sellerWallet = await Wallet.findOne({ where: { user_id: seller.user_id } });
            await sellerWallet.increment('amount', { by: payload.seller_gain });

            res.status(200).send({ payload, msg: 'Order status updated successfully' });
        } catch (error) {
            res.status(500).json({ err: 'Failed to update order status', error: error.message });
        }
    },
    payExistingOzowOrder: async (req, res) => {
        try {
            const { order_id, user_id } = req.body;

            const order = await Order.findOne({ where: { order_id } });

            if (!order) {
                return res.status(404).json({ err: 'Order not found' });
            }


            const currentWalletAmount = await Wallet.findOne({ where: { user_id } });

            if (currentWalletAmount?.dataValues?.amount == 0) {
                const requestBody = await generateRequestHash(order?.dataValues, +order_id);

                logger.info('Existing Ozow Order - Pay existing order with zero funds in wallet', requestBody);
                triggerOzowPayment(requestBody, res);
                return;
            }

            if (currentWalletAmount?.dataValues?.amount >= order?.dataValues?.total_price) {
                await Wallet.update({ amount: (+currentWalletAmount?.dataValues?.amount - +order?.dataValues?.total_price).toFixed(2) }, { where: { user_id } });

                logger.info('Existing Ozow Order - Pay existing order with greater than price funds in wallet', order?.dataValues);
                await handleNoGatewayOrder(order?.dataValues, res);
                return;

            }

            if (+currentWalletAmount?.dataValues?.amount < +order?.dataValues?.total_price) {
                await Wallet.update({ amount: '0.00' }, { where: { user_id } });

                const requestBody = await generateRequestHash({ ...order?.dataValues, total_price: order?.dataValues?.total_price - currentWalletAmount?.dataValues?.amount }, +order_id);

                logger.info('Existing Ozow Order - Pay existing order with lesser than price funds in wallet', requestBody);
                triggerOzowPayment(requestBody, res);
                return;

            }
        } catch (error) {
            logger.error('Error processing existing order payment:', error);
            res.status(500).json({ error: error.message || 'Failed to process existing order payment' });
        }
    }

};