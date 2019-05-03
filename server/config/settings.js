const refreshMaxAge = Math.floor(1000 * 60 * 60 * 24 * 2); // 2 days
const accessMaxAge = Math.floor(1000 * 60 * 15); // 15 min
let COOKIE_SETTINGS = {
    httpOnly: true,
    secure: false,
    signed: true,
    sameSite: true,
    domain: process.env.ROOT_DOMAIN
};

module.exports.isDev = (app) => app.get('env') === 'development' ? true : false;
module.exports.CORS = {
    origin: (origin, callback) => {
        const re = `(http(s)?\\:\\/\\/)?\\b${process.env.ROOT_DOMAIN}(:?\\d+(\\/)?)?`;
        const domain = new RegExp(re, 'g');
        if (origin && origin.match(domain)) {
            callback(null, true);
        } else {
            console.log('corsissue');
            callback(500);
        }
    },
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    preflightContinue: true,
    optionsSuccessStatus: 200
};

module.exports.refreshMaxAge = (today) => today ? Math.floor((today.getTime() / 1000) + refreshMaxAge) : refreshMaxAge; // 2 days
module.exports.accessMaxAge = (today) => today ? Math.floor((today.getTime() /  1000) + accessMaxAge) : accessMaxAge; // 15 mins

module.exports.SET_COOKIE_SETTINGS = (app) => {
    COOKIE_SETTINGS.secure = app.get('env') === 'development' ? false : true;
} 
module.exports.COOKIE_SETTINGS = COOKIE_SETTINGS;