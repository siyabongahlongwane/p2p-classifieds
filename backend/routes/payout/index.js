const express = require('express');
const router = express.Router();
const payout = require('../../controllers/payoutsController');

router.post('/create-payout', payout.createPayout);
router.post('/fetch-payouts', payout.fetchPayouts);
router.put('/update-payout', payout.updatePayout);

module.exports = router;