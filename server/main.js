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
const jwt = require('jsonwebtoken');
const createTokens = require('./util/createTokens');
const { SET_COOKIE_SETTINGS, refreshMaxAge, accessMaxAge } = settings;
SET_COOKIE_SETTINGS(app);
const { COOKIE_SETTINGS } = settings;

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
  .then(async () => {
    console.log('mongoose connected');
  
    const toBeChecked = [{
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      roles: process.env.USER_ROLES.split('.')
    }, {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      roles: process.env.ADMIN_ROLES.split('.')
    }];

    const users = await User.find({ email: { $in: [ process.env.USER_EMAIL, process.env.ADMIN_EMAIL ] } });
    toBeChecked.forEach(user => {
      const hasUser = users.some(v => v.email === user.email);
      if (!hasUser) {
        let newUser = new User();
        newUser.email = user.email;
        newUser.setPassword(user.password);
        newUser.roles = user.roles;
        newUser.save();
      }
    });
  }).catch((e) => {
    console.log(e);
  });


// init passport
passportConfig(passport);

// Passport middleware
app.use(passport.initialize());

// parse cookies ability
app.use(cookieParser(process.env.JWT_SECRET));

// config bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());

// response for CORS
app.use(cors(settings.CORS));

// EVERY API CALL BELOW
// CHECK access token and set id on req
// CHECK refresh token
// CHECK token against db
// CHECK for invalidated cookie
// RENEW exp and set cookie
// SET user on req by verifying access_token and refresh_token on req.signedCookie before API mount
app.use(async (req, res, next) => {
  const refreshToken = req.signedCookies['refresh_token'];
  const accessToken = req.signedCookies['access_token'];
  if (!refreshToken && !accessToken) return next();

  try {
    const data = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.userId = data.id;
  } catch (e) {
    console.log('invalid access token');
  }

  if (!refreshToken) return next();

  let data;

  try {
    data = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (e) {
    console.log('invalid refresh token');
    return next();
  }

  const u = await User.findOne({_id: req.userId});

  if (!u || u.count !== data.count) {
    console.log('intenional invalidation');
    return next();
  }

  const tokens = createTokens(u);

  res.cookie('refresh_token', tokens.refresh, { ...COOKIE_SETTINGS, maxAge: refreshMaxAge() });
  res.cookie('access_token', tokens.access, { ...COOKIE_SETTINGS, maxAge: accessMaxAge()});
  const { id, email, roles } = u;
  req.user = { id, email, roles };
  next();
});

// API Mount
const APIV1 = '/api/v1';

// API Route
app.use(APIV1, auth);

// catch 404 and return error
app.use((err, req, res, next) => {
  if (err) return res.status(err['status'] || 500).json({ message: err['message'] });
  return res.status(404);
});

module.exports = app;