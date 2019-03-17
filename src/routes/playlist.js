const express = require('express');
const router = express.Router();
const playlist = require('../controllers/playlist');

router.post('/add', playlist.add);

router.get('/get/:genre/:date', playlist.get);

module.exports = router;
