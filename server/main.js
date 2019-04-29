const express = require('express');
const settings = require('./config/settings');
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
const limit = require('express-rate-limit');
const cors = require('cors');
const isDev = settings.isDev(app);
const helmet = require('helmet');

app.disable('x-powered-by');

// Logging
app.use(morgan('dev'));

// serve cookies through the proxy
app.set('trust proxy', 1);
app.use(helmet());
app.use(limit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 
}));

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


// init passport
passportConfig(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

const SESSION_FULL = {
  name: 'rfj',
  cookie: sess,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  unset: 'destroy',
  resave: false,
  saveUninitialized: false // if nothing has changed.. do not restore cookie
};

// use session config
app.use(session(SESSION_FULL));

// config bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());

// response for CORS
app.use(cors(settings.CORS));

// API Mount
const APIV1 = '/api/v1';

// API Route
app.use(APIV1, auth);
// Basic policy
// app.use(`${APIV1}/*`, claimPermission.basic, function(err, req, res, next) {
//     return next(err);
// });

app.get('/*', function(req, res, next) {
  if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
    return next({ status: 404, message: 'Not Found' });
  }
});

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  if (err) {
    return next(err);
  }

  err['status'] = 404;
  return next(err);
});

// production error handler
app.use((err, res) => {
  res.status(err['status'] || 500);
});

module.exports = app;