const express = require('express');
const router = express.Router();
const wallet = require('../../controllers/walletController');

router.get('/fetch-wallet', wallet.fetchWallet);
router.put('/update-wallet', wallet.updateWallet);

module.exports = router;