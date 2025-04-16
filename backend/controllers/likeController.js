const { models: { Like, ProductPhoto, Product, User } } = require('../db_models');

module.exports = {
    addLike: async (req, res) => {
        try {
            await Like.create({ ...req.body });

            const liked_products = await fetchLikes(req.body.user_id);

            if (!liked_products) return res.status(500).json({ err: 'Error fetching likes' });
            return res.status(200).json({ msg: 'Item liked successfully', payload: liked_products, success: true });

        } catch (err) {
            console.error(err);

            return res.status(400).json(err);
        }
    },
    removeLike: async (req, res) => {
        const { like_id } = req.params;
        try {
            await Like.destroy({
                where: {
                    like_id: +like_id
                }
            });

            const liked_products = await fetchLikes(req.user.user_id);

            if (!liked_products) return res.status(500).json({ err: 'Error fetching updated likes' });
            res.status(200).json({ msg: 'Item like removed successfully', payload: liked_products, success: true })
        } catch (err) {
            console.error(err);

            return res.status(400).json(err);
        }
    },


    fetch: async (req, res) => {
        const { user_id } = req.user;
        try {
            if (!user_id) return res.status(400).json({ err: 'User id not provided!' });

            const liked_products = await fetchLikes(user_id);

            if (!liked_products) return res.status(500).json({ err: 'Error fetching likes' });
            res.status(200).json({ payload: liked_products, success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err: 'Error fetching likes' });
        }
    }
}

const fetchLikes = async (userId) => {
    const data = await User.findByPk(userId,
        {
            include: {
                model: Product,
                as: 'liked_products',
                include: [
                    { model: ProductPhoto, as: 'photos' }
                ],
            },
        });
    return data?.liked_products;
}