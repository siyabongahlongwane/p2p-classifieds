const { models: { User, Shop, Wallet, BankingDetail } } = require('../db_models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const mail = require('../utils/mail');

module.exports = {
    create: async (req, res) => {
        try {
            const { email } = req.body;
            const password = await bcrypt.hash(req.body.password, 10);

            await User.create({
                ...req.body,
                password
            });

            const dbUser = await User.findOne({
                where: {
                    email
                },
            });

            const { first_name, last_name, user_id, roles } = dbUser.dataValues;

            const newShop = await Shop.create({
                "user_id": user_id,
                "name": `${first_name}_${last_name}_${user_id}`,
                "link": `${first_name}_${last_name}_${user_id}`,
                "location": null,
            });

            await User.update({ shop_id: newShop.dataValues.shop_id },
                {
                    where: { user_id }
                }
            )

            const emailData = {
                name: `${first_name} ${last_name}`,
                year: new Date().getFullYear(),
            }


            const token = sign({ email, roles, user_id }, process.env.ACCESS_TOKEN_SECRET);
            delete dbUser.dataValues.password;
            res.status(200).json({ payload: { ...dbUser.dataValues, shop_id: newShop.dataValues.shop_id }, token, msg: 'Registration Successful', success: true });

            await mail(email, 'Schoolthrifties is excited to welcome you!', 'welcome-notification', emailData);
            await Wallet.create({ user_id, amount: 0 });
            await BankingDetail.create({ user_id, account_holder: `${first_name} ${last_name}` });

        } catch (err) {
            console.error(err);

            switch (err?.parent?.code) {
                case 'ER_DUP_ENTRY':
                    err = { err: 'Email already registered, please log in' }
                    break;

                default:
                    break;
            }
            return res.status(400).json(err);
        }
    },
    signWithPassword: async (req, res) => {
        try {
            const { email, password } = req.query;

            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (!user) {
                res.status(400).json({ err: 'Email not registered' });
                return
            }

            if (user && await bcrypt.compare(password, user.password)) {
                const { email, roles, user_id } = user;
                const token = sign({ email, roles, user_id }, process.env.ACCESS_TOKEN_SECRET);
                delete user.password;
                return res.status(200).json({ payload: user, token, success: true });
            }

            return res.status(400).json({ err: 'Incorrect Credentials' });
        } catch (err) {
            console.error(err);
            return res.status(400).json(err);
        }
    },
    signInWithOTP: async (req, res) => {
        try {
            const { email, password } = req.query;

            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (user && await bcrypt.compare(password, user.password)) {
                const token = sign({ email: user.email, roles: user.roles }, process.env.ACCESS_TOKEN_SECRET);
                return res.status(200).json({ payload: user, token, success: true });
            }

            return res.status(400).json({ err: 'Incorrect Credentials' });
        } catch (err) {
            console.error(err);
            return res.status(400).json(err);
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { user_id } = req.params;

            const user = await User.findOne({
                where: {
                    user_id
                }
            });

            if (!user) {
                return res.status(404).json({ err: 'Profile not found' });
            }

            await user.update({ ...req.body }, { where: { user_id } });

            const payload = await User.findOne({
                where: {
                    user_id
                }
            });

            return res.status(200).json({ payload, msg: 'Profile updated successfully' });
        } catch (err) {
            console.error(err);
            return res.status(400).json(err);
        }
    }
}