const express = require('express');
const router = express.Router();
const playlist = require('../controllers/playlist');

router.post('/add', playlist.add);

router.get('/get/:genre', playlist.get);

module.exports = router;
