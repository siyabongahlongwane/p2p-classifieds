const express = require('express');
const { shop } = require('../../controllers');
const { authMiddleware, authorizeParent } = require('../../middleware/auth');

const router = express.Router();

router.post('/create', authMiddleware, authorizeParent, shop.create);
router.get('/fetch-shops', shop.fetch);
router.get('/fetch-own-shop', authMiddleware, shop.fetchOwnShop);
router.put('/update-shop', authMiddleware, authorizeParent, shop.updateShop);
router.get('/fetch-shop-closure/:shop_id', shop.fetchShopClosure);
router.put('/update-shop-closure', authMiddleware, authorizeParent, shop.updateShopClosure);

module.exports = router;