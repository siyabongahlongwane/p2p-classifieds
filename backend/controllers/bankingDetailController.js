const { models: { BankingDetail } } = require('../db_models');

module.exports = {
    createBankingDetail: async (req, res) => {
        try {

            const bankingDetail = await BankingDetail.create({ ...req.body });

            return res.status(201).json({ payload: bankingDetail, msg: 'Banking Details created successfully' });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    fetchBankingDetail: async (req, res) => {
        try {
            const { user_id } = req.user;
            const bankingDetail = await BankingDetail.findOne({
                where: { user_id }
            });

            if (!bankingDetail) {
                return res.status(404).json({ err: 'Banking Detail not found' });
            }

            return res.status(200).json({ payload: bankingDetail });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    updateBankingDetail: async (req, res) => {
        try {
            const { user_id } = req.user;

            const bankingDetail = await BankingDetail.findOne({
                where: { user_id }
            });

            if (!bankingDetail) {
                return res.status(404).json({ err: 'Banking Detail not found' });
            }

            await bankingDetail.update({ ...req.body }, { where: { user_id } });

            return res.status(200).json({ payload: bankingDetail, msg: 'Banking Details updated successfully' });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
}