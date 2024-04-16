//const bodyParser=require('body-parser').json()
const express = require('express');
const {
        signup,login
        ,logout,forgotPassword,trueCode
        ,verifyCode,resetPassword
        ,resetPasswordByButton,protect
        ,updatePassword,profile
        ,updateMe,deleteMe
        ,googleLoginMobile
        ,facebookLoginMobile
        ,facebookLogin } = require('./../controllers/userControllers');
const passportSetup = require('./../utils/googleStrategy')
const FacebookStrategy = require('./../utils/facebookStrategy');
const passport = require("passport");
const req = require('express/lib/request');
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect,logout);


router.post('/forgetPassword', forgotPassword);
router.post('/verifyCode',trueCode, verifyCode);
router.patch('/resetPassword',trueCode, resetPassword);
router.patch('/resetPasswordByButton/:token', resetPasswordByButton);

router.patch(
    '/updatePassword',
    protect,
    updatePassword
  );
router.route('/profile').get( protect,profile);
patch( protect,uploadUserPhoto,updateMe)
.delete(protect,deleteMe);


router.get('/auth/google',passport.authenticate('google', { scope: ["email", "profile"] }))
router.get( '/auth/google/callback',passport.authorize(googleLogin));

router.post('/googleAuth',googleLoginMobile)
router.post('/facebookAuth',facebookLoginMobile)

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}));
router.get('/auth/facebook/callback',passport.authenticate('facebook',{session:false}),facebookLogin);

module.exports = router;
