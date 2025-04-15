const express = require('express');
const { category } = require('../../controllers');
const { authorizeAdmin } = require('../../middleware/auth');
const router = express.Router();

router.post('/create', authorizeAdmin, category.create);
router.get('/fetch', category.fetch);
router.patch('/update/:category_id', authorizeAdmin, category.update);
router.delete('/delete/:category_id', authorizeAdmin, category.remove);

module.exports = router;