const express = require('express');
const router = express.Router();
const wallet = require('../../controllers//bankingDetailController');
const { authorizeResourceOwner } = require('../../middleware/auth');

router.get('/fetch-banking-details', authorizeResourceOwner('BankingDetail', 'user_id'), wallet.fetchBankingDetail);
router.post('/create-banking-details', authorizeResourceOwner('BankingDetail', 'user_id'), wallet.createBankingDetail);
router.put('/update-banking-details/:user_id', authorizeResourceOwner('BankingDetail', 'user_id'), wallet.updateBankingDetail);

module.exports = router;