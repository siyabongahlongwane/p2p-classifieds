const express = require('express');
const { product } = require('../../controllers');
const router = express.Router();

router.post('/add-new-product', product.create);
router.get('/fetch', product.fetch);
router.put('/update-product/:product_id', product.update);
router.delete('/delete/:product_id', product.remove);

module.exports = router;