const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const config = require('./../config/config.local');
const Mail = require('./../mail');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ message: "Sent malphormed EMAIL", success: false });
        } else {
            if (!req.body.username) {
                res.json({ message: "Sent malphormed USERNAME", success: false });
            } else {
                if (!req.body.password) {
                    res.json({ message: "Sent malphormed PASSWORD", success: false });
                } else {
                    let user = new User({
                        username: req.body.username.toLowerCase(),
                        email: req.body.email.toLowerCase(),
                        password: req.body.password,
                        nombre: req.body.nombre,
                        temporaryToken: jwt.sign({ username: req.body.username.toLowerCase() }, config.secret, { expiresIn: '24h' }),
                    });
                    user.save((err) => {
                        if (err) {
                            if (err.code === 11000) {
                                res.json({ message: "User or email already exists", success: false });
                            } else if (err.errors) {
                                if (err.errors.email) {
                                    res.json({ message: err.errors.email.message, success: false });
                                } else if (err.errors.username) {
                                    res.json({ message: err.errors.username.message, success: false });
                                } else if (err.errors.password) {
                                    res.json({ message: err.errors.password.message, success: false });
                                } else {
                                    console.log(err);
                                    res.json({ success: false, message: err });
                                }
                            }
                        } else {
                            console.log('enviando el email');
                            var options = {
                                to: user.email,
                                subject: 'Localhost activation link',
                                text: 'Hello ' + user.nombre + ', ' + '<br> <br> Por favor pincha en el enlace para confirmar ' +
                                    'la cuenta en (localhost.com: http://localhost:4200/activate/' + user.temporaryToken + ')',
                                html: 'Hello ' + user.nombre + ', ' + '<br> <br> Por favor pincha en el enlace para confirmar ' +
                                    'la cuenta en (localhost.com)<br><br> <a href="http://localhost:4200/activate/' + user.temporaryToken +
                                    '">http://localhost:4200/activate</a> '
                            };

                            var mail = new Mail({
                                to: options.to,
                                subject: options.subject,
                                text: options.text,
                                html: options.html,
                                successCallback: function (suc) {
                                    console.log('success');
                                },
                                errorCallback: function (err) {
                                    console.log('error: ' + err);
                                }
                            });

                            mail.send();
                            res.json({ message: "Usuario creado!", success: true });
                        }
                    });
                }
            }
        }
    });

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({ success: false, message: "No se ha especificado e-mail." });
        } else {
            User.findOne({ email: req.params.email.trim() }, (err, usr) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (usr) {
                        res.json({ message: "El email ya ha sido registrado!", success: false });
                    } else {
                        res.json({ message: "Email disponible ", success: true });
                    }
                }
            });
        }
    });

    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: "No se ha especificado e-mail." });
        } else {
            User.findOne({ username: req.params.username }, (err, usr) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (usr) {
                        res.json({ message: "El nombre de usuario ya ha sido registrado!", success: false });
                    } else {
                        res.json({ message: "Nombre de usuario disponible ", success: true });
                    }
                }
            });
        }
    });

    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({ message: "No se ha seleccionado ningun nombre de usuario", success: false });
        } else if (!req.body.password) {
            res.json({ message: "No se ha proporcionado contraseña", success: false });
        } else {
            User.findOne({ username: req.body.username.toLowerCase() }).select('username password active').exec((err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else if (!user) {
                    res.json({ success: false, message: "Usuario no existente." });
                } else if (!user.comparePassword(req.body.password)) {
                    res.json({ success: false, message: "Usuario o contraseña incorrectos." });
                } else if (!user.active) {
                    res.json({ success: false, message: "Esta cuenta no ha sido activada. Por favor revise el correo.", expired: true });
                } else {
                    console.log(user);
                    const token = jwt.sign({ userid: user._id }, config.secret, { expiresIn: '24h' });
                    res.json({ success: true, message: "Bienvenido " + user.username, token: token, user: user });
                }
            }
            );
        }
    });

    router.post('/resend', (req, res) => {
        if (!req.body.username) {
            res.json({ message: "No se ha seleccionado ningun nombre de usuario", success: false });
        } else if (!req.body.password) {
            res.json({ message: "No se ha proporcionado contraseña", success: false });
        } else {
            User.findOneAndUpdate(
                { username: req.body.username.toLowerCase() },
                { temporaryToken: jwt.sign({ username: req.body.username.toLowerCase() }, config.secret, { expiresIn: '24h' }) },
                { new: true, fields: { "password": 1, "nombre": 1, "active": 1, "email": 1, "temporaryToken": 1 } },
                (err, user) => {
                    console.log(err);
                    console.log(user);
                    console.log(req.body);
                    if (err) {
                        res.json({ success: false, message: err });
                    } else if (!user) {
                        res.json({ success: false, message: "Usuario no existente." });
                    } else if (!user.comparePassword(req.body.password)) {
                        res.json({ success: false, message: "Usuario o contraseña incorrectos." });
                    } else if (user.active) {
                        res.json({ success: false, message: "Esta cuenta ya está activada  ." });
                    } else {
                        var options = {
                            to: user.email,
                            subject: 'Resend Activation link',
                            text: 'Hola ' + user.nombre + '. Este es el link para activar tu cuenta http://localhost:4200/activate/' + user.temporaryToken + '',
                            html: 'Hola ' + user.nombre + ', ' + '<br> <br> Este es el link para activar tu cuenta. ' +
                                '(localhost)<br><br> <a href="http://localhost:4200/activate/' + user.temporaryToken +
                                '">http://localhost:4200/activate</a> '
                        };

                        var mail = new Mail({
                            to: options.to,
                            subject: options.subject,
                            text: options.text,
                            html: options.html,
                            successCallback: function (suc) {
                                console.log('success');
                            },
                            errorCallback: function (err) {
                                console.log('error: ' + err);
                            }
                        });

                        mail.send();
                        res.json({ success: true, message: 'Email de confirmacion se ha enviado a ' + user.email });
                    }
                }
            );
        }
    });

    router.put('/activate/:token', (req, res) => {
        const token = req.params.token;
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.log(err);
                console.log('err');
                res.json({ succes: false, message: 'Activation link has expired.' });
            } else {
                console.log('todo ok continuamos.');
                User.findOneAndUpdate({ temporaryToken: req.params.token }, { active: true, $unset: { temporaryToken: '' } }, (err, user) => {
                    if (err) {
                        res.json({ succes: false, message: err });
                    } else {
                        console.log(user.email);
                        var options = {
                            to: user.email,
                            subject: 'Localhost cuenta activada!',
                            html: 'Hello ' + user.nombre + ', ' + '<br> <br> Tu cuenta ha sido activada correctamente',
                            text: 'Hello ' + user.nombre + ', ' + '. Tu cuenta ha sido activada correctamente'
                        };

                        var mail = new Mail({
                            to: options.to,
                            subject: options.subject,
                            html: options.hmtml,
                            text: options.text,
                            successCallback: function (suc) {
                                console.log('Correo enviado correctamente');
                            },
                            errorCallback: function (err) {
                                console.log('error: ' + err);
                            }
                        });

                        mail.send();

                        res.json({ succes: true, message: 'Account has been activated.' });
                    }
                });
            }
        });
        // User.findOne({ temporaryToken: req.params.token }, (err, user) => {
        //     if (err) {
        //         console.log('err');
        //         res.json({ succes: false, message: err });
        //     } else {
        //         console.log('user');
        //         const token = req.params.token;
        //         jwt.verify(token, config.secret, (err, decoded) => {
        //             if (err) {
        //                 console.log('err');
        //                 res.json({ succes: false, message: 'Activation link has expired.' });
        //             } else if (!user) {
        //                 console.log('No user found');
        //                 res.json({ succes: false, message: 'Activation link has expired.' });
        //             } else {
        //                 console.log('todo ok continuamos.');
        //                 user.temporaryToken = '';
        //                 user.active = true;
        //                 user.save((err) => {
        //                     if (err) {
        //                         console.log('error al guardar entonces.');
        //                         console.log(err);
        //                         res.json({ succes: false, message: err });
        //                     } else {

        //                         var options = {
        //                             to: user.email,
        //                             subject: 'Localhost cuenta activada!',
        //                             message: 'Hello' + user.name + ', ' + '<br> <br> Tu cuenta ha sido activada correctamente'
        //                         };

        //                         var mail = new Mail({
        //                             to: options.to,
        //                             subject: options.subject,
        //                             message: options.message,
        //                             successCallback: function (suc) {
        //                                 console.log('success');
        //                             },
        //                             errorCallback: function (err) {
        //                                 console.log('error: ' + err);
        //                             }
        //                         });

        //                         res.json({ succes: true, message: 'Account has been activated.' });
        //                     }
        //                 });
        //             }
        //         });
        //     }
        // });
    });

    router.use((req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            res.json({ success: false, message: 'No token provided.' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ succes: false, message: err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userid }, (err, data) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (!data) {
                res.json({ success: false, message: 'User not found' });
            } else {
                res.json({ success: true, message: 'User found', user: data });
            }
        });
    });

    return router;
};