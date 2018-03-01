const crypto = require('crypto');
var buf = crypto.randomBytes(256).toString('hex');

module.exports = {
    name: 'localhost',
    db: 'social-ufv',
    uri: 'mongodb://localhost:27017/social-ufv',
    secret: buf
}