const { logger } = require("firebase-functions");
const { models: { Order, User, OrderItem, Product, Cart, Wallet } } = require('../db_models');
const mail = require("../utils/mail");

const sendEmailsToBuyerAndSeller = async (order) => {
    const { user_id, shop_id, total_price, items, shipping_method, delivery_cost, order_id, seller_gain: seller_order_gain } = order;

    const [buyer, seller] = await Promise.all([
        User.findOne({ where: { user_id: user_id } }),
        User.findOne({ where: { shop_id: shop_id } })
    ]);

    const { email: buyer_email, first_name: buyer_first_name, last_name: buyer_last_name } = buyer;
    const { email: seller_email, first_name: seller_first_name, last_name: seller_last_name } = seller;

    const emailData = {
        buyerName: `${buyer_first_name} ${buyer_last_name}`,
        sellerName: `${seller_first_name} ${seller_last_name}`,
        items: [{ title: 'Shipping Option', description: shipping_method, price: delivery_cost }],
        totalAmount: `R${total_price}`,
        year: new Date().getFullYear(),
        url: `${process.env.CLIENT_URL}/orders/view-order/${order_id}`,
    }

    emailData.items = [...items.map(({ product: { title, price, description } }) => ({ title, description, price })), ...emailData.items];

    await mail(buyer_email, 'Your Order Confirmation', 'order-confirmation', emailData);

    emailData.items = [...items.map(({ product: { title, seller_gain, description } }) => ({ title, description, seller_gain })), emailData.items.pop()];

    emailData.totalAmount = `R${(+seller_order_gain + +delivery_cost).toFixed(2)}`;
    await mail(seller_email, `Cha-Ching! Incoming Order from ${emailData.buyerName}`, 'seller-order-notification', emailData);
};

module.exports = {
    notify: async (req, res) => {
        const data = req.body;
        logger.info('Post Pay Screen', { data });
        if (data?.['Status'] == 'Complete') {
            logger.info('Complete Screen');
            try {
                const order = await Order.findByPk(+data?.['Optional1'], {
                    include: {
                        model: OrderItem,
                        as: 'items',
                        include: {
                            model: Product,
                            as: 'product',
                        },
                    },
                });
                if (!order) return res.status(400).send('Order not found');

                await order.update({ isPaid: true, datePaid: new Date(), status: 'Paid' });

                // Bulk update the status of the products to 'Sold'
                await Product.update(
                    { status: 'Sold' },
                    { where: { product_id: order.items.map(item => item.product_id) } }
                );

                // Bulk removal of the sold cart items
                await Cart.destroy({ where: { user_id: +order.user_id } });
                sendEmailsToBuyerAndSeller(order);

                logger.info('Order updated successfully', order);
                res.status(200).send({ msg: 'Order paid successfully' });
                return;
            } catch (error) {
                logger.error('Error updating order', error);
                return res.status(500).send('Error updating order');
            }

        }
        if (data?.['Status'] == 'Abandoned' || data?.['Status'] == 'Cancelled') {
            logger.info('Abandoned or Canceled Order');
            try {
                const order = await Order.findByPk(+data?.['Optional1'], {
                    include: {
                        model: OrderItem,
                        as: 'items',
                        include: {
                            model: Product,
                            as: 'product',
                        },
                    },
                });
                if (!order) return res.status(400).send('Order not found');

                if (+order.non_discounted_price != +data?.['Amount']) {
                    const buyerWallet = await Wallet.findOne({ where: { user_id: order.user_id } });
                    await buyerWallet.increment('amount', { by: order.non_discounted_price - data?.['Amount'] });

                    logger.info('Wallet refunded successfully', order);
                    res.status(200).send({ msg: 'Wallet refunded successfully' });
                }
                return;
            } catch (error) {
                logger.error('Error updating order', error);
                return res.status(500).send('Error updating order');
            }

        }
        else {
            res.status(500).send({ error: 'Error updating order' });
        }
    },
    sendEmailsToBuyerAndSeller
}
