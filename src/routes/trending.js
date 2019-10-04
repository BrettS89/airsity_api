const router = require('express').Router();
const trendingControllers = require('../controllers/trending');

router.get('/get', trendingControllers.getTop25);

module.exports = router;