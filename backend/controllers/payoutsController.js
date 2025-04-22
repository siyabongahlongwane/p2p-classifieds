const { models: { Payout, Wallet, User } } = require('../db_models');
const mail = require('../utils/mail');

module.exports = {
    createPayout: async (req, res) => {
        try {
            const { user_id } = req.user;

            const { name: bank_name, account_number, account_holder } = req.body;

            const user = await User.findByPk(user_id);

            const { shop_id, first_name, last_name, email } = user;

            const wallet = await Wallet.findOne({ where: { user_id } });

            await Payout.create({
                user_id, amount: wallet.amount, bank_name, account_number, account_holder, shop_id
            });

            const emailData = {
                seller_name: `${first_name} ${last_name}`,
                amount: wallet.amount,
                adminUrl: `${process.env.CLIENT_URL}/admin/dashboard`,
                website_url: `${process.env.CLIENT_URL}/my-wallet`,
                year: new Date().getFullYear(),
            }

            await Wallet.update({ amount: 0 }, { where: { user_id } });

            await mail(email, 'Payout Request', 'seller-payout-notification', emailData);
            await mail('support@schoolthrifties.co.za', 'Payout Request', 'admin-payout-notification', emailData);

            return res.status(201).json({ payload: { amount: 0 }, msg: 'Payout created successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ err: error.message });
        }
    },
    fetchPayouts: async (req, res) => {
        try {
            const { user_id, roles } = req.user;

            const isAdmin = roles.includes('1');
            const payout = isAdmin ? await Payout.findAll({ order: [['payout_id', 'DESC']] }) : await Payout.findAll({
                where: { user_id }
            });

            if (!payout) {
                return res.status(404).json({ err: 'Payout not found' });
            }

            return res.status(200).json({ payload: payout });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
    updatePayout: async (req, res) => {
        try {
            const { payout_id } = req.body;

            const payout = await Payout.findOne({
                where: { payout_id }
            });

            if (!payout) {
                return res.status(404).json({ err: 'Payout not found' });
            }

            await payout.update({ status: 'Paid', datePaid: new Date().toISOString() }, { where: { user_id: payout.user_id } });

            return res.status(200).json({ payload: payout });
        } catch (error) {
            return res.status(500).json({ err: error.message });
        }
    },
}