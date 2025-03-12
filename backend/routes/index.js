const express = require('express');
const userRoutes = require('./auth');
const productRoutes = require('./product');
const shopRoutes = require('./shop');
const categoryRoutes = require('./category');
const likeRoutes = require('./like');
const cartRoutes = require('./cart');
const orderRoutes = require('./order');
const paymentRoutes = require('./ozow');
const walletRoutes = require('./wallet');
const payoutsRoutes = require('./payout');
const bankingRoutes = require('./banking');
const shopShippingRoutes = require('./shopShippingConfig');

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/product', productRoutes);
router.use('/shop', shopRoutes);
router.use('/categories', categoryRoutes);
router.use('/likes', likeRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/wallet', walletRoutes);
router.use('/payouts', payoutsRoutes);
router.use('/banking', bankingRoutes);
router.use('/shop-shipping', shopShippingRoutes);

module.exports = router;