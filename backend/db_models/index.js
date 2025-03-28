const Sequelize = require('sequelize');
const config = require('../config/config');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
});

sequelize.authenticate().then(() => {
    console.log("MySQL connection successful");
}).catch(err => {
    console.error(err);
});

const db = {};
db.sequelize = sequelize;
db.models = {};

// Import existing models
db.models.User = require('./User')(sequelize, Sequelize.DataTypes);
db.models.Product = require('./Product')(sequelize, Sequelize.DataTypes);
db.models.ProductPhoto = require('./ProductPhoto')(sequelize, Sequelize.DataTypes);
db.models.Cart = require('./Cart')(sequelize, Sequelize.DataTypes);
db.models.Like = require('./Like')(sequelize, Sequelize.DataTypes);
db.models.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.models.Shop = require('./Shop')(sequelize, Sequelize.DataTypes);
db.models.Order = require('./Order')(sequelize, Sequelize.DataTypes);
db.models.OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);
db.models.Wallet = require('./Wallet')(sequelize, Sequelize.DataTypes);
db.models.Payout = require('./Payout')(sequelize, Sequelize.DataTypes);
db.models.BankingDetail = require('./BankingDetail')(sequelize, Sequelize.DataTypes);
db.models.ShippingMethod = require('./ShippingMethod')(sequelize, Sequelize.DataTypes);
db.models.GlobalShippingPrice = require('./GlobalShippingPrices')(sequelize, Sequelize.DataTypes);

// User and Shop (One-to-One)
db.models.User.hasOne(db.models.Shop, {
    foreignKey: 'user_id',
    as: 'shop',
});
db.models.Shop.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'owner',
});

// Shop and Product (One-to-Many)
db.models.Shop.hasMany(db.models.Product, {
    foreignKey: 'shop_id',
    as: 'products',
});
db.models.Product.belongsTo(db.models.Shop, {
    foreignKey: 'shop_id',
    as: 'shop',
});

// User and Product (Many-to-Many for Likes)
db.models.User.belongsToMany(db.models.Product, {
    through: 'like_item',
    foreignKey: 'user_id',
    otherKey: 'product_id',
    as: 'liked_products',
});
db.models.Product.belongsToMany(db.models.User, {
    through: 'like_item',
    foreignKey: 'product_id',
    otherKey: 'user_id',
    as: 'likers',
});

// User and Product (Many-to-Many for Cart)
db.models.User.belongsToMany(db.models.Product, {
    through: 'cart_item',
    foreignKey: 'user_id',
    otherKey: 'product_id',
    as: 'cart',
});
db.models.Product.belongsToMany(db.models.User, {
    through: 'cart_item',
    foreignKey: 'product_id',
    otherKey: 'user_id',
    as: 'cart_users',
});

// Product and ProductPhoto (One-to-Many)
db.models.Product.hasMany(db.models.ProductPhoto, {
    foreignKey: 'product_id',
    as: 'photos',
});
db.models.ProductPhoto.belongsTo(db.models.Product, {
    foreignKey: 'product_id',
    as: 'product',
});


// User and Order (One-to-Many)
db.models.User.hasMany(db.models.Order, {
    foreignKey: 'user_id',
    as: 'orders',
});
db.models.Order.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'user',
});

// Order and OrderItem (One-to-Many)
db.models.Order.hasMany(db.models.OrderItem, {
    foreignKey: 'order_id',
    as: 'items',
});
db.models.OrderItem.belongsTo(db.models.Order, {
    foreignKey: 'order_id',
    as: 'order',
});

// Product and OrderItem (One-to-Many)
db.models.Product.hasMany(db.models.OrderItem, {
    foreignKey: 'product_id',
    as: 'order_items',
});
db.models.OrderItem.belongsTo(db.models.Product, {
    foreignKey: 'product_id',
    as: 'product',
});

// User and Wallet (One-to-One)
db.models.User.hasOne(db.models.Wallet, {
    foreignKey: 'user_id',
    as: 'wallet',
});
db.models.Wallet.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'user',
});

// User and Payout (One-to-One)
db.models.User.hasMany(db.models.Payout, {
    foreignKey: 'user_id',
    as: 'payout',
});
db.models.Payout.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'user',
});

// User and BankingDetail (One-to-One)
db.models.User.hasOne(db.models.BankingDetail, {
    foreignKey: 'user_id',
    as: 'banking_detail',
});
db.models.BankingDetail.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'user',
});

// User and BankingDetail (One-to-One)
db.models.Shop.hasMany(db.models.ShippingMethod, {
    foreignKey: 'user_id',
    as: 'shipping_method',
});
db.models.ShippingMethod.belongsTo(db.models.Shop, {
    foreignKey: 'shop_id',
    as: 'shop',
});

// Import Chat Models
const { Chat, Message, ChatParticipant } = require('./ChatModels')(sequelize, Sequelize.DataTypes);
db.models.Chat = Chat;
db.models.Message = Message;
db.models.ChatParticipant = ChatParticipant;

// Chat Associations
db.models.User.hasMany(Chat, { foreignKey: 'user1_id', as: 'chats1' });
db.models.User.hasMany(Chat, { foreignKey: 'user2_id', as: 'chats2' });
db.models.Chat.belongsTo(db.models.User, { foreignKey: 'user1_id', as: 'user1' });
db.models.Chat.belongsTo(db.models.User, { foreignKey: 'user2_id', as: 'user2' });

db.models.Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages' });
Chat.belongsTo(Message, { foreignKey: 'last_message_id', as: 'lastMessage' });

db.models.Message.belongsTo(db.models.Chat, { foreignKey: 'chat_id' });
db.models.Message.belongsTo(db.models.User, { foreignKey: 'sender_id', as: 'sender' });

db.models.Chat.belongsToMany(db.models.User, { through: ChatParticipant, foreignKey: 'chat_id', as: 'participants' });
db.models.User.belongsToMany(db.models.Chat, { through: ChatParticipant, foreignKey: 'user_id', as: 'user_chats' });



module.exports = db;
