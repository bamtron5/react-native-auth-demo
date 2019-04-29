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