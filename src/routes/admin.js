const express = require('express');
const auth = require('../controllers/auth');
const admin = require('../controllers/admin');
const router = express.Router();

router.post('/login', auth.adminLogin);
router.post('/addsongs', admin.addSongs);
router.post('/sendpushnotifications', admin.sendPushNotifications);
router.get('/useranalytics', admin.userAnalytics);

module.exports = router;
