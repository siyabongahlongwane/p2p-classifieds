const { models: { Shop, Product, ProductPhoto, ShopClosure } } = require('../db_models');

module.exports = {
    create: async (req, res) => {
        try {
            await Shop.create({ ...req.body });

            res.status(200).json({ msg: 'Shop created successfully', success: true });
        } catch (err) {
            console.error(err);

            return res.status(400).json(err);
        }
    },

    fetch: async (req, res) => {
        try {
            const { mustHaveProducts } = req.query;
            delete req.query.mustHaveProducts;

            let shops = await Shop.findAll({
                where: {
                    ...req.query
                },
                include: [
                    {
                        model: Product,
                        as: 'products',
                        // attributes: ['product_id']
                        include: [
                            {
                                model: ProductPhoto,
                                as: 'photos',
                                // attributes: ['photo_id', 'photo_url'] // Select only required fields
                            }
                        ]
                    },
                    {
                        model: ShopClosure,
                        as: 'shop_closure',
                    }
                ]
            })

            if (!shops) return res.status(400).json({ err: 'No shops found' });
            if (mustHaveProducts) shops = shops.filter(shop => shop.products.length > 0);

            res.status(200).json({ payload: shops, success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err });
        }
    },
    updateShop: async (req, res) => {
        try {
            const { user_id } = req.user;

            const shop = await Shop.findOne({
                where: { user_id }
            });

            if (!shop) {
                return res.status(404).json({ err: 'Shop not found' });
            }

            await shop.update({ ...req.body }, { where: { user_id } });

            return res.status(200).json({ payload: shop, success: true });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    fetchShopClosure: async (req, res) => {
        try {
            const { shop_id } = req.params;

            const shopClosure = await ShopClosure.findOne({
                where: { shop_id }
            });

            if (!shopClosure) {
                return res.status(404).json({ err: 'Away date details not found' });
            }

            return res.status(200).json({ payload: shopClosure, success: true });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    updateShopClosure: async (req, res) => {
        try {
            const { shop_id } = req.params;

            const shopClosure = await ShopClosure.findOne({
                where: { shop_id }
            });

            if (!shopClosure) {
                return res.status(404).json({ err: 'Away date details not found' });
            }

            await shopClosure.update({ ...req.body }, { where: { shop_id } });

            return res.status(200).json({ payload: shopClosure, msg: 'Away date updated successfully', success: true });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    }
}