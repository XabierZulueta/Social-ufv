var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'universidad.test123@gmail.com',
    service: 'gmail',
    auth: {
        user: 'universidad.test123@gmail.com',
        pass: 'j7o5BbdcqLdfee9O'
    }
});

module.exports = function (params) {
    this.from = 'universidad.test123@gmail.com';

    this.send = function () {
        var options = {
            from: this.from,
            to: params.to,
            subject: params.subject,
            text: params.message
        };

        transporter.sendMail(options, function (err, suc) {
            err ? params.errorCallback(err) : params.successCallback(suc);
        });
    };
};