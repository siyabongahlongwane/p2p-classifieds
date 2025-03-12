const express = require('express');
const { category } = require('../../controllers');
const router = express.Router();

router.post('/create', category.create);
router.get('/fetch', category.fetch);
router.patch('/update/:category_id', category.update);
router.delete('/delete/:category_id', category.remove);

module.exports = router;