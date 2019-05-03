const jwt = require('jsonwebtoken');
module.exports = (roles) => {
    return (req, res, next) => {
        const accessToken = req.signedCookies['access_token'];
        if (!accessToken) return next({ status: 401, message: 'Permission Denied' });
        let token;
        try {
            token = jwt.verify(accessToken, process.env.JWT_SECRET);
        } catch (e) {
            return next({ status: 401, message: 'Permission Denied' });
        }

        if (!token.roles) return next({ status: 401, message: 'Permission Denied' });

        return roles.every(role => token.roles.some(v => role === v)) ? next() : next({ status: 401, message: 'Permission Denied' });
    }
}