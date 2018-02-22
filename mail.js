var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({

    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'universidad.test123@gmail.com',
        pass: 'j7o5BbdcqLdfee9O'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
}));

module.exports = function (params) {
    this.from = 'Actividades y Eventos Ufv, universidad.test123@gmail.com';

    this.send = function () {
        var options = {
            from: this.from,
            to: params.to,
            subject: params.subject,
            html: params.html,
            text: params.text
        };

        transporter.sendMail(options, function (err, suc) {
            err ? params.errorCallback(err) : params.successCallback(suc);
        });
    };
};