const { models: { Cart, ProductPhoto, Product, User } } = require('../db_models');

module.exports = {
    addToCart: async (req, res) => {
        try {
            await Cart.create({ ...req.body });

            const cart = await fetchCart(req.body.user_id);

            if (!cart) return res.status(500).json({ err: 'Error fetching cart' });
            return res.status(200).json({ msg: 'Item added to cart', payload: cart, success: true });

        } catch (err) {
            console.error(err);

            return res.status(400).json(err);
        }
    },
    removeFromCart: async (req, res) => {
        const { cart_item_id } = req.params;
        console.log(req.user);
        try {
            await Cart.destroy({
                where: {
                    cart_item_id: +cart_item_id
                }
            });

            const cart = await fetchCart(req.user.user_id);

            if (!cart) return res.status(500).json({ err: 'Error fetching updated cart' });
            res.status(200).json({ msg: 'Item removed from cart', payload: cart, success: true })
        } catch (err) {
            console.error(err);

            return res.status(400).json(err);
        }
    },


    fetchCart: async (req, res) => {
        const { user_id } = req.user;
        try {
            if (!user_id) return res.status(400).json({ err: 'User id not provided!' });

            const cart = await fetchCart(user_id);

            if (!cart) return res.status(500).json({ err: 'Error fetching cart' });
            res.status(200).json({ payload: cart, success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err: 'Error fetching cart' });
        }
    }
}

const fetchCart = async (userId) => {
    const data = await User.findByPk(userId,
        {
            include: {
                model: Product,
                as: 'cart',
                include: [
                    { model: ProductPhoto, as: 'photos' }
                ],
            },
        }
    );

    return data?.cart;
}