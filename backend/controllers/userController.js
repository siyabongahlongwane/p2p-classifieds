const { models: { User } } = require('../db_models');
const bcrypt = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const { createUser, findUser, updateUser } = require('../utils/user');
const { Op } = require('sequelize');

module.exports = {
    create: async (req, res) => {
        const { email } = req.body;

        try {
            const { dbUser, newShop } = await createUser(req.body);
            const { user_id, roles } = dbUser.dataValues;

            const token = sign({ email, roles, user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
            delete dbUser.dataValues.password;
            res.status(200).json({ payload: { ...dbUser.dataValues, shop_id: newShop.dataValues.shop_id }, token, msg: 'Registration Successful', success: true });

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
                const token = sign({ email, roles, user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
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
                const token = sign({ email: user.email, roles: user.roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
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
    },
    failedLogin: async (req, res) => {
        console.log('Google Sign In FAILED')
        try {
            res.redirect(`${process.env.CLIENT_URL}/sign-in/failed`);
            res.redirect(`${process.env.CLIENT_URL}/sign-in?error=Error Logging In`);
        } catch ({ message, status = 401 }) {
            res.redirect(`${process.env.CLIENT_URL}/sign-in?error=${message || 'Error Logging In'}`);
        }
    },
    successLogin: async (req, res) => {
        const profile = req?.user;
        console.log('PROFILE', profile);

        try {
            if (profile) {
                const email = profile?.emails?.[0]?.value;
                const { id: google_id, name } = profile;
                const query = {
                    [Op.or]: [
                        {
                            email
                        },
                        {
                            google_id
                        },
                    ],
                }

                console.log('USER Not Found', email);
                const userExists = await findUser(query);
                if (!userExists) {
                    console.log('USER Not Found', email);
                    const body = {
                        google_id,
                        first_name: name?.givenName,
                        last_name: name?.familyName,
                        email,
                        phone: '00000000000',
                        password: process.env.DEFAULT_PASSWORD
                    }

                    try {
                        const { dbUser, newShop } = await createUser(body);
                        const { user_id, roles } = dbUser.dataValues;

                        delete dbUser.password;

                        const token = sign({ user_id, email, roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                        const encodeStr = encodeURIComponent(JSON.stringify({ user: { ...dbUser?.dataValues, shop_id: newShop.shop_id }, token }));

                        res.redirect(`${process.env.CLIENT_URL}/sign-in?hash=${encodeStr}`);
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
                    return;
                }

                console.log('USER EXIST', userExists?.dataValues);

                const { user_id, roles } = userExists;

                if (!userExists?.google_id) {
                    await updateUser(user_id, { google_id })
                }

                const token = sign({ user_id, email, roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                const encodeStr = encodeURIComponent(JSON.stringify({ user: { ...userExists, shop_id: newShop.shop_id }, token }));

                res.redirect(`${process.env.CLIENT_URL}/sign-in?hash=${encodeStr}`);
            } else {
                res.redirect(`${process.env.CLIENT_URL}/sign-in?error=Google profile not found`);
            }
        } catch (error) {
            console.error(error);
            res.redirect(`${process.env.CLIENT_URL}/sign-in?error=Error logging into your Google Profile`);

        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await findUser({ email });

            if (!user) {
                res.status(404).send({ err: 'Email not registered' });
                return;
            }
            const { user_id } = user;

            const token = sign({ user_id, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '5m'
            });

            const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

            return res.status(200).json({ msg: 'Reset link sent', resetLink });
        } catch (error) {
            console.error(error);
            return res.status(400).json(error);
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token, password } = req.body;

            if (!token || !password) {
                return res.status(400).json({ err: "Token and new password are required" });
            }

            // Verify token
            let payload;
            try {
                payload = verify(token, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
            } catch (err) {
                return res.status(401).json({ err: "Invalid or expired token, please go back and try again" });
            }

            const { user_id } = payload;

            const user = await findUser({ user_id });

            if (!user) {
                return res.status(404).json({ err: "User not found" });
            }

            // Hash the new password (assuming you use bcrypt)
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user in the DB
            await updateUser(user_id, { password: hashedPassword });

            return res.status(200).json({ msg: "Password has been reset successfully" });
        } catch (error) {
            console.error("Reset password error:", error);
            return res.status(500).json({ err: "Something went wrong" });
        }
    }

}