const express = require('express');
const songs = require('../controllers/songs');
const router = express.Router();

router.post('/add', songs.add);

router.get('/get/:genre', songs.getOld);

router.get('/get/:genre/:sort', songs.get);

router.get('/getnoauth/:genre', songs.getNonMember);

module.exports = router;
