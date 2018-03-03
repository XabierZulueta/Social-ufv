var randomBytes = require('randombytes')(256).toString('hex');

module.exports = {
    name: 'desarrollo',
    db: 'social-ufv',
    uri: 'mongodb://jorge:contrasena@ds159274.mlab.com:59274/social-ufv',
    url_web: 'https://social-ufv.herokuapp.com'
};
