const express = require('express');
const router = express.Router();
const wallet = require('../../controllers//bankingDetailController');

router.get('/fetch-banking-details', wallet.fetchBankingDetail);
router.post('/create-banking-details', wallet.createBankingDetail);
router.put('/update-banking-details/:user_id', wallet.updateBankingDetail);

module.exports = router;