const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    db: 'social-ufv',
    uri: 'mongodb://localhost:27017/social-ufv',
    secret: crypto,
    url_web: 'http://localhost:4200'
};
