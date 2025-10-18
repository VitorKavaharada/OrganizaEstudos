const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/register', AuthController.showRegister);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

router.get('/forgot-password', AuthController.showForgotPassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/reset-password', AuthController.showResetPassword);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;