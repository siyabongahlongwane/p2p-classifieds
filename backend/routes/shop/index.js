const express = require('express');
const { shop } = require('../../controllers');
// const classifiedsParentsMiddleware = require('../../../middleware/classifiedsParentsMiddleware');
const router = express.Router();

router.post('/create', shop.create);
router.get('/fetch-shops', shop.fetch);
router.put('/update-shop/:user_id', shop.updateShop);

module.exports = router;