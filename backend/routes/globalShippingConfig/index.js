const express = require('express');
const { globalShipping } = require('../../controllers');
const router = express.Router();

router.get('/fetch-global-shipping-config', globalShipping.fetchShippingMethod);
router.post('/create-global-shipping-config', globalShipping.createShippingMethod);
router.put('/update-global-shipping-config/:shop_id', globalShipping.updateShippingMethod);

module.exports = router;