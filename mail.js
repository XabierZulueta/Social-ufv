var fs = require('fs');
var path = require('path');
var config = JSON.parse(fs.readFileSync('config/config.json'));

var nodemailer = require('nodemailer'); 

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'universidad.test123@gmail.com',
        pass: 'j7o5BbdcqLdfee9O'
    }
});

let HelperOptions = {
    from: 'Prueba <universidad.test123@gmail.com>',
    to: 'jorge.manza1@gmail.com',
    subject: 'tested',
    text: 'Hello world'
};

transporter.sendMail(HelperOptions, (err, info) => { 
    if(err){
        console.log(err);
        return console.log('nothing send');
    } else {
        console.log('Email sent');
        console.log(info);
    }
});