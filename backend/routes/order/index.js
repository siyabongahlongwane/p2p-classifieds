const express = require('express');
const { order } = require('../../controllers');
const router = express.Router();

router.post('/create-order', order.createOrder);
router.get('/fetch-orders', order.fetchOrdersWithItems);
router.post('/update-customer-order-status', order.updateCustomerOrderStatus);
router.post('/update-seller-order-status', order.updateSellerOrderStatus);
router.post('/pay-existing-ozow-order', order.payExistingOzowOrder);

module.exports = router;