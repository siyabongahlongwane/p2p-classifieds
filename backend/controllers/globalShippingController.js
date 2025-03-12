const { models: { ShippingMethod } } = require('../db_models');

module.exports = {
    createShippingMethod: async (req, res) => {
        try {

            const ShippingMethod = await ShippingMethod.create({ ...req.body });

            return res.status(201).json({ payload: ShippingMethod, msg: 'Shipping Method created successfully' });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    fetchShippingMethod: async (req, res) => {
        try {
            const { shop_id } = req.query;
            const shippingMethod = await ShippingMethod.findAll({
                where: { shop_id }
            });

            if (!shippingMethod) {
                return res.status(404).json({ err: 'Shipping Method not found' });
            }

            return res.status(200).json({ payload: shippingMethod });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    updateShippingMethod: async (req, res) => {
        try {
            const { shop_id } = req.params;

            const shippingMethod = await ShippingMethod.findAll({
                where: { shop_id }
            });

            if (!shippingMethod) {
                return res.status(404).json({ err: 'Banking Detail not found' });
            }

            await shippingMethod.update({ ...req.body }, { where: { shop_id } });

            return res.status(200).json({ payload: shippingMethod, msg: 'Shipping Method updated successfully' });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
}