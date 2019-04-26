const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const passport = require('passport');
const auth = require('./api/auth');
const User = require('./model/User');
const passportConfig = require('./config/passport');
const app = express();
const isDev = app.get('env') === 'development' ? true : false;

// Logging
app.use(morgan('dev'));

// Connect to db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('mongoose connected');
    User.findOne({email: 'b@b.com'}, (err, user) => {
      if (err) return;
      if (user) return;
      if (!user)
        var newUser = new User();
        newUser.email = process.env.USER_EMAIL;
        newUser.setPassword(process.env.USER_PASSWORD);
        newUser.roles = ['user'];
        newUser.save();
    });
  }).catch((e) => {
    console.log(e);
  });

// serve cookies through the proxy
app.set('trust proxy', 1);

// init passport
passportConfig(passport);

// parse cookies ability
app.use(cookieParser());

// config req.session
let sess = {
  maxAge: 24 * 60 * 60 * 1000 * 2, //  2 days
  secure: false,
  httpOnly: true
};

// set to secure in production
if (!isDev) {
  sess.secure = true;
}

// use session config
app.use(
  session({
    cookie: sess,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    unset: 'destroy',
    resave: false,
    saveUninitialized: false // if nothing has changed.. do not restore cookie
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// config bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());

const APIV1 = '/api/v1';

app.use(APIV1, auth);

module.exports = app;