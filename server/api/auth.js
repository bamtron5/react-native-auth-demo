const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./../model/User');
const createTokens = require('./../util/createTokens');
const settings = require('./../config/settings');
const { COOKIE_SETTINGS, refreshMaxAge, accessMaxAge } = settings;
const guard = require('./../middleware/guard');

router.get('/auth/currentuser', (req, res, next) => res.json(req.user || {}));

router.post('/auth/register', function(req, res, next) {
    const {email, password} = req.body;
    if (!req.body && !email && !password) return next({message: 'user did not save'});

    let user = new User();
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function(err, user) {
        if (err) return next({message: 'user did not save', error: err});
        if (user) return res.json({message: 'Registration complete.'});
    });
});

router.post('/auth/login',
    passport.authenticate('local'),
    (req, res, next) => {
        if (!req.user) return next({message: 'invalid' });
        const tokens = createTokens(req.user);
        res.cookie('refresh_token', tokens.refresh, { ...COOKIE_SETTINGS, maxAge: refreshMaxAge() });
        res.cookie('access_token', tokens.access, { ...COOKIE_SETTINGS, maxAge: accessMaxAge() });
        res.json({ auth: req.isAuthenticated() });
    }
);

router.get('/auth/logout', (req, res, next) => {
    req.logout();
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    res.json({ auth: req.isAuthenticated() });
});

router.get('/auth/invalidate', async (req, res, next) => {
    if (!req.user) return next({ status: 403, message: 'invalid request' });
    const user = await User.findOne({ _id: req.user.id });
    if (!user) return next({ status: 403, message: 'invalid request' });
    user.count += 1;
    await user.save();

    return res.json({ invalidated: true });
});

router.get('/auth/adminStuff', guard(['admin']), (req, res, next) => {
    return res.json({ secretJSON: true });
});

router.get('/auth/userStuff', guard(['user']), (req, res, next) => {
    return res.json({ userJSON: true });
});

module.exports = router;