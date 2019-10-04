const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const keys = require('./src/config');
const appRoutes = require('./src/routes/app');
const authRoutes = require('./src/routes/auth');
const songRoutes = require('./src/routes/songs');
const listenedRoutes = require('./src/routes/listened');
const playlistRoutes = require('./src/routes/playlist');
const adminRoutes = require('./src/routes/admin');
const trendingRoutes = require('./src/routes/trending');

const app = express();
app.use(cors())

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/trending', trendingRoutes);
app.use('/admin', adminRoutes);
app.use('/playlist', playlistRoutes);
app.use('/listened', listenedRoutes);
app.use('/songs', songRoutes);
app.use('/auth', authRoutes);
app.use('/', appRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
