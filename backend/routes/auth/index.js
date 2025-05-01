const express = require('express');
const { user } = require('../../controllers');
const router = express.Router();
const passport = require('../../utils/passport');
const { authorizeResourceOwner, authMiddleware } = require('../../middleware/auth');

router.get('/sign-in', user.signWithPassword);
router.post('/sign-up', user.create);
router.post('/forgot-password', user.forgotPassword);
router.post('/reset-password', user.resetPassword);
router.put('/update-profile', authMiddleware, authorizeResourceOwner('User', 'user_id'), user.updateProfile);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/failed', user.failedLogin);
router.get('/login/success', user.successLogin);
router.get('/google/callback', passport.authenticate("google", {
    successRedirect: `${process.env.SERVER_URL}/auth/login/success`,
    failureRedirect: `${process.env.SERVER_URL}/auth/login/failed`
}));

module.exports = router;