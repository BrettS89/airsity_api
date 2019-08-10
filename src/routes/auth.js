const express = require('express');
const auth = require('../controllers/auth');
const router = express.Router();

router.post('/signup', auth.signup);

router.post('/login', auth.login);

router.post('/facebook', auth.facebookAuth);

router.post('/setstreaming', auth.setStreamingService);

router.get('/isloggedin', auth.isLoggedIn);

router.post('/setpushtoken', auth.setPushToken);

module.exports = router;
