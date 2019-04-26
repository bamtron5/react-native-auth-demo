const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./../model/User');

router.get('/auth/currentuser', (req, res, next) => res.json(req.user || {}));

router.post('/auth/register', function(req, res, next) {
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
    (req, res, next) => res.json({ auth: req.isAuthenticated() })
);

router.get('/auth/logout', (req, res, next) => {
    req.logout();
    res.json({ auth: req.isAuthenticated() });
});

module.exports = router;