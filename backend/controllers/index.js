const controllers = {};

controllers.user = require('./userController');
controllers.product = require('./productController');
controllers.shop = require('./shopController');
controllers.category = require('./categoryController');
controllers.like = require('./likeController');
controllers.cart = require('./cartController');
controllers.order = require('./orderController');
controllers.ozow = require('./ozowController');
controllers.payout = require('./payoutsController');
controllers.bankingDetail = require('./bankingDetailController');
controllers.shopShipping = require('./shopShippingController');
controllers.globalShipping = require('./globalShippingController');
controllers.chat = require('./chatController');

module.exports = controllers;