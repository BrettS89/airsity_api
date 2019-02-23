const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('You found the Airsity api!');
});

module.exports = router;
