const { models: { Wallet } } = require('../db_models');

module.exports = {
    createWallet: async (req, res) => {
        try {
            const { user_id } = req.body;

            const wallet = await Wallet.create({
                user_id,
                amount: '0'
            });

            return res.status(201).json({ payload: wallet });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    fetchWallet: async (req, res) => {
        try {
            const { user_id } = req.user;
            const wallet = await Wallet.findOne({
                where: { user_id }
            });

            if (!wallet) {
                return res.status(404).json({ err: 'Wallet not found' });
            }

            return res.status(200).json({ payload: wallet });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    updateWallet: async (req, res) => {
        try {
            const { user_id } = req.user;
            const { amount } = req.body;

            const wallet = await Wallet.findOne({
                where: { user_id }
            });

            if (!wallet) {
                return res.status(404).json({ err: 'Wallet not found' });
            }

            await wallet.update({ amount }, { where: { user_id } });

            return res.status(200).json({ payload: wallet });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
}