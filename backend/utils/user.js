const { models: { User, Shop, Wallet, BankingDetail, ShopClosure } } = require('../db_models');
const bcrypt = require('bcrypt');
const mail = require('./mail');

const createUser = async (body) => {
    const { email } = body;
    const password = await bcrypt.hash(body.password, 10);

    await User.create({
        ...body,
        password
    });

    const dbUser = await User.findOne({
        where: {
            email
        },
    });

    const { first_name, last_name, user_id } = dbUser.dataValues;

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
        settingsUrl: `${process.env.CLIENT_URL}/settings`,
        year: new Date().getFullYear(),
    }

    await mail(email, 'Schoolthrifties is excited to welcome you!', 'welcome-notification', emailData);
    await Wallet.create({ user_id, amount: 0 });
    await BankingDetail.create({ user_id, account_holder: `${first_name} ${last_name}` });

    await ShopClosure.create({
        shop_id: newShop.dataValues.shop_id,
        start_date: new Date(),
        end_date: new Date(),
        reason: '',
        is_active: false
    });

    return { dbUser: { ...dbUser.dataValues, shop_id: newShop.dataValues.shop_id } };
}

const findUser = async (query) => {
    const user = await User.findOne({
        where: query
    });

    return user;
}

const updateUser = async (user_id, newData) => {
    return await User.update(
        { ...newData },
        { where: { user_id } });
}

module.exports = { createUser, findUser, updateUser };