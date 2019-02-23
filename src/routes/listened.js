const express = require('express');
const router = express.Router();
const listened = require('../controllers/listened');

router.post('/add', listened.add);

module.exports = router;
