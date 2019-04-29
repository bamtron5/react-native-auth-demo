const LocalStrat = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./../model/User');
const passportJWT = require('passport-jwt');
const { ExtractJwt } = passportJWT;
const JWTStrat = passportJWT.Strategy;

module.exports = function(passport) {
    passport.use(
        new LocalStrat({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
            User.findOne({ email: email })
                .select('+passwordHash +salt')
                .exec((err, user) => {
                    if (!user) return done(null, false, { message: 'Invalid request' });
                    if (err) return done(err);
                    if (!user.validatePassword(password)) return done(null, false, { message: 'Invalid request' });
                    user.passwordHash = undefined;
                    user.salt = undefined;
                    return done(null, user);
                });
        })
    );

    passport.use(
        new JWTStrat({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, function(jwtPayload, cb) {
            return User.findOne({id: jwtPayload.id})
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
