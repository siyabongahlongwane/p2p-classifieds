const express = require('express');
const { product } = require('../../controllers');
const { authMiddleware, authorizeParent } = require('../../middleware/auth');
const router = express.Router();

router.post('/add-new-product', authMiddleware, authorizeParent, product.create);
router.get('/fetch', product.fetch);
router.put('/update-product/:product_id', authMiddleware, authorizeParent, product.update);
router.delete('/delete/:product_id', authMiddleware, authorizeParent, product.remove);

module.exports = router;