const jwt = require('jsonwebtoken');
module.exports = (reqRoles) => {
    return (req, res, next) => {
        if (!req.user) return next({ status: 401, message: 'Permission Denied' });
        
        const { roles } = req.user;

        if (!roles) return next({ status: 401, message: 'Permission Denied' });

        return reqRoles[0] === '*' || reqRoles.every(reqRole => roles.some(role => reqRole === role))
            ? next() 
            : next({ status: 401, message: 'Permission Denied' });
    }
}