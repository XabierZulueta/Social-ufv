const User = require('../models/User');

module.exports = (router) => {

    router.get('/users/representantes', (req, res) => {
        User.find({ role: { $ne: 'alumno' } }).select('username nombre').exec((err, users) => {
            if (err) {
                console.log(err);
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, message: 'representantes', representantes: users });
            }
        });
    });

    return router;
};

