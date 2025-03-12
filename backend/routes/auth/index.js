const express = require('express');
const { user } = require('../../controllers');
const router = express.Router();

router.get('/sign-in', user.signWithPassword);
router.post('/sign-up', user.create);
router.put('/update-profile/:user_id', user.updateProfile);

module.exports = router;