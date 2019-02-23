const express = require('express');
const songs = require('../controllers/songs');
const router = express.Router();

router.post('/add', songs.add);

router.get('/get/:genre', songs.get);

router.get('/getnoauth/:genre', songs.getNonMember);

module.exports = router;
