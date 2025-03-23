const express = require('express');
const { user } = require('../../controllers');
const router = express.Router();
const passport = require('../../utils/passport');

router.get('/sign-in', user.signWithPassword);
router.post('/sign-up', user.create);
router.put('/update-profile/:user_id', user.updateProfile);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/failed', user.failedLogin);
router.get('/login/success', user.successLogin);
router.get('/google/callback', passport.authenticate("google", {
    successRedirect: `${process.env.SERVER_URL}/auth/login/success`,
    failureRedirect: `${process.env.SERVER_URL}/auth/login/failed`
}));

module.exports = router;