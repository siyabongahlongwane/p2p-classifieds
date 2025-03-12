const express = require('express');
const { shopShipping } = require('../../controllers');
const router = express.Router();

router.get('/fetch-shipping-config', shopShipping.fetchShippingMethod);
router.post('/create-shipping-config', shopShipping.createShippingMethod);
router.put('/update-shipping-config/:shop_id', shopShipping.updateShippingMethod);

module.exports = router;