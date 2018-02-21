const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    db: 'social-ufv',
    uri: 'mongodb://jorge:contrasena@ds159274.mlab.com:59274/social-ufv',
    secret: crypto,
    url_web: 'https://social-ufv.herokuapp.com'
};
