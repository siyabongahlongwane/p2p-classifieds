const express = require('express');
const { like } = require('../../controllers');
const router = express.Router();

router.post('/add-like', like.addLike);
router.get('/fetch-likes', like.fetch);
router.delete('/remove-like/:like_id', like.removeLike);

module.exports = router;