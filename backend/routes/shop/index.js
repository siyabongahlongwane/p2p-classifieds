const express = require('express');
const { shop } = require('../../controllers');
const { authMiddleware, authorizeParent } = require('../../middleware/auth');

const router = express.Router();

router.post('/create', authMiddleware, authorizeParent, shop.create);
router.get('/fetch-shops', shop.fetch);
router.put('/update-shop/:user_id', authMiddleware, authorizeParent, shop.updateShop);
router.get('/fetch-shop-closure/:shop_id', shop.fetchShopClosure);
router.put('/update-shop-closure/:shop_id', authMiddleware, authorizeParent, shop.updateShopClosure);

module.exports = router;