const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = require('http').createServer(app);


const port = process.env.PORT || 3000;
///////////////////////////////fb///////////////////////////////
// const passport_fb = require('passport');
// const passport    = require('./config/passport');
// app.use(session({ secret: 'keyboard cat', key: 'sid'}));
// app.use(passport.initialize());
// app.use(passport.session());


require('./server/config/middleware.js') (app,express);
require('./server/config/routes.js') (app,express);


///////////////////////database////////////////////////
const mongoURI = process.env.MONGODB_URI ||'mongodb://localhost/utalent';
mongoose.connect(mongoURI);
db = mongoose.connection;
db.once('open', () => {
	console.log('mongoDB is open');
});




////////////////////server////////////////////////////
app.listen(port, () => {
  console.log('App listening on port:', port);
})

module.exports = app;