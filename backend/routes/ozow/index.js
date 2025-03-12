const express = require('express');
const { ozow } = require('../../controllers');
const router = express.Router();

router.post('/ozow/notify', ozow.notify);
// router.get('/update-order', order.updateOrder);

module.exports = router;