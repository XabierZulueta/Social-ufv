const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const config = require('./../config/config.dev');
const Mail = require('./../mail');

module.exports = (router) => {

    router.get('/authentication/reset/username/:email', (req, res) => {
        User.findOne({ email: req.params.email }).select('nombre username email').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (!req.params.email) {
                res.json({ success: false, message: 'No se ha especificado email.' });
            } else if (!user) {
                res.json({ success: false, message: 'Este email no esta registrado, por favor, registrese.' });
            } else {

                var options = {
                    to: user.email,
                    subject: 'Localhost usuario olvidado.',
                    text: 'Hola ' + user.nombre + '! Tu nombre de usuario es: ' + user.username +
                        '. Puede entrar con el siguiente enlace: ' + config.url_web + '/login',
                    html: 'Hola ' + user.nombre + '! ' + '<br> <br> Tu nombre de usuario es: ' + user.username +
                        '<br><br>Puede entrar con el siguiente enlace: <a href="' + config.url_web + '/login">social-ufv</a> '
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

                res.json({ success: true, message: 'El nombre de usuario ha sido enviado a tu email. Por favor compruebe su bandeja de entrada.' });
            }
        });
    });

    router.put('/authentication/reset/password', (req, res) => {
        User.findOne({ username: req.body.username }).select('nombre username resetToken email active').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (!user) {
                res.json({ success: false, message: 'Este usuario no esta registrado, por favor, registrese.' });
            } else if (!user.active) {
                res.json({ success: false, message: 'La cuenta todavia no ha sido activada.' });
            } else {
                user.resetToken = jwt.sign({ username: req.body.username.toLowerCase() }, config.secret, { expiresIn: '72h' });
                console.log(user);
                user.save((err) => {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {

                        var options = {
                            to: user.email,
                            subject: 'Localhost contraseña olvidada olvidado.',
                            text: 'Hola ' + user.nombre + '! Has solicidado el cambio de contraseña, por favor pincha en el siguiente enlace para cambiar la contraseña: ' +
                                config.url_web + ' /reset/' + user.resetToken,
                            html: 'Hola ' + user.nombre + '! ' + '<br> <br> Has solicidado el cambio de contraseña, por favor pincha en el siguiente enlace para cambiar la contraseña: ' +
                                '<a href="' + config.url_web + '/reset/' + user.resetToken + '">Cambiar contraseña</a> '
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
                        res.json({ success: true, message: 'Por favor, revise el correo para cambiar la contraseña' });
                    }
                });
            }
        });
    });

    router.get('/authentication/reset/password/:token', (req, res) => {
        User.findOne({ resetToken: req.params.token }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (!user) {
                res.json({ success: false, message: 'No se ha encontrado usuario con ese nombre', redirect: true });
            } else {
                const token = req.params.token;

                jwt.verify(token, config.secret, (err, decoded) => {
                    if (err) {
                        res.json({ success: false, message: 'El link de la contraseña ha expirado: ', error: err, decoded: decoded });
                    } else {
                        res.json({ success: true, message: 'Usuario encontrado', user: user });
                    }
                });
            }
        });
    });

    router.put('/authentication/save/password', (req, res) => {
        console.log(req.body);
        if (!req.body.password) {
            res.json({ success: false, message: 'No se ha facilitado contraseña' });
        } else {
            User.findOne({ username: req.body.username }).select('nombre resetToken password username email').exec((err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else if (!user) {
                    res.json({ success: false, message: 'No se ha encontrado usuario con ese nombre', redirect: true });
                } else {
                    user.password = req.body.password;
                    user.resetToken = false;

                    user.save((err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {

                            var options = {
                                to: user.email,
                                subject: 'Contraseña cambiada.',
                                text: 'Hola ' + user.nombre + '! Tu contraseña ha sido cambiada correctamente.' + config.url_web + '/login/',
                                html: 'Hola ' + user.nombre + '! ' + '<br> <br> Tu contraseña ha sido cambiada correctamente.' +
                                    '<a href="' + config.url_web + '/login/">Log in</a> '
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

                            res.json({ success: true, message: 'Contraseña cambiada correctamente' });
                        }
                    });
                }
            });
        }
    });

    router.post('/authentication/register', (req, res) => {
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
                            var options = {
                                to: user.email,
                                subject: 'Localhost activation link',
                                text: 'Hello ' + user.nombre + ', ' + '<br> <br> Por favor pincha en el enlace para confirmar ' +
                                    'la cuenta en (localhost.com: ' + config.url_web + '/activate/' + user.temporaryToken + ')',
                                html: 'Hello ' + user.nombre + ', ' + '<br> <br> Por favor pincha en el enlace para confirmar ' +
                                    'la cuenta en (localhost.com)<br><br> <a href="' + config.url_web + '/activate/' + user.temporaryToken +
                                    '">Activar Cuenta</a> '
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

    router.get('/authentication/checkEmail/:email', (req, res) => {
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

    router.get('/authentication/checkUsername/:username', (req, res) => {
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

    router.post('/authentication/login', (req, res) => {
        if (!req.body.username) {
            res.json({ message: "No se ha seleccionado ningun nombre de usuario", success: false });
        } else if (!req.body.password) {
            res.json({ message: "No se ha proporcionado contraseña", success: false });
        } else {
            User.findOne({ username: req.body.username.toLowerCase() }).select('username password active role').exec((err, user) => {
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

    router.post('/authentication/resend', (req, res) => {
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
                            text: 'Hola ' + user.nombre + '. Este es el link para activar tu cuenta ' + config.url_web + '/activate/' + user.temporaryToken + '',
                            html: 'Hola ' + user.nombre + ', ' + '<br> <br> Este es el link para activar tu cuenta. ' +
                                '(localhost)<br><br> <a href="' + config.url_web + '/activate/' + user.temporaryToken +
                                '">Activar cuenta</a> '
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

    router.put('/authentication/activate/:token', (req, res) => {
        const token = req.params.token;
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Activation link has expired.' });
            } else {
                console.log('todo ok continuamos.');
                User.findOneAndUpdate({ temporaryToken: req.params.token }, { active: true, $unset: { temporaryToken: '' } }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err });
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

                        res.json({ success: true, message: 'Account has been activated.' });
                    }
                });
            }
        });
    });

    router.use((req, res, next) => {
        const token = req.headers.authorization;
        console.log('router.use');
        if (!token) {
            res.json({ success: false, message: 'No token provided.' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    router.get('/authentication/profile', (req, res) => {
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