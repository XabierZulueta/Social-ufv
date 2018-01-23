const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    db: 'social-ufv',
    uri: 'mongodb://xabier:xabier@ds159274.mlab.com:59274/social-ufv',
    secret: crypto
}