const jwt = require('jsonwebtoken');
const settings = require('./../config/settings');
const { refreshMaxAge, accessMaxAge } = settings;
module.exports = function createTokens(user) {
    const { id, count, roles } = user;
    const date = new Date();
    const refresh = jwt.sign({ iat: date.getTime(), expiresIn: refreshMaxAge(date), count }, process.env.JWT_SECRET);
    const access = jwt.sign({ iat: date.getTime(), expiresIn: accessMaxAge(date), id, roles }, process.env.JWT_SECRET);
    return { refresh, access };
}