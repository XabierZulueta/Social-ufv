const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    name: 'local',
    db: 'social-ufv',
    uri: 'mongodb://localhost:27017/social-ufv',
    secret: crypto
}