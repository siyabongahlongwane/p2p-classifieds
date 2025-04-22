const express = require('express');
const router = express.Router();
const payout = require('../../controllers/payoutsController');
const { authorizeAdmin } = require('../../middleware/auth');

router.post('/create-payout', payout.createPayout);
router.post('/fetch-payouts', payout.fetchPayouts);
router.put('/update-payout', authorizeAdmin, payout.updatePayout);

module.exports = router;