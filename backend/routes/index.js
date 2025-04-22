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
const chatsRoutes = require('./message');
const pudoRoutes = require('./pudo');

const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/product', productRoutes);
router.use('/shop', shopRoutes);
router.use('/categories', categoryRoutes);
router.use('/likes', authMiddleware, likeRoutes);
router.use('/cart', authMiddleware, cartRoutes);
router.use('/orders', authMiddleware, orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/wallet', authMiddleware, walletRoutes);
router.use('/payouts', authMiddleware, payoutsRoutes);
router.use('/banking', authMiddleware, bankingRoutes);
router.use('/shop-shipping', shopShippingRoutes);
router.use('/chats', authMiddleware, chatsRoutes);
router.use('/pudo', pudoRoutes);

module.exports = router;