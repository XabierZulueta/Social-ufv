const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const functions = require('./AuthFunctions');
const nodemailer = require('nodemailer');

var Mail = require('../mail');


module.exports = (router) => {
    // CRUD OPERATIONS:
    // GET ALL (READ)

    router.get('/grupos/testEmail', (req, res) => {

        var options = {
            to: 'jorge.manza1@gmail.com',
            subject: 'subject',
            message: 'your message goes here'
        };

        var mail = new Mail({
            to: options.to,
            subject: options.subject,
            message: options.message,
            successCallback: function (suc) {
                console.log('success');
            },
            errorCallback: function (err) {
                console.log('error: ' + err);
            }
        });

        mail.send();

        Grupo.find({}, (err, grupos) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            res.json({ success: true, message: 'Grupos', grupos: grupos });
        });
    });

    router.get('/grupos', (req, res) => {
        Grupo.find({}, (err, grupos) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            res.json({ success: true, message: 'Grupos', grupos: grupos });
        });
    });

    // GET ONE BY ID (READ)
    router.get('/grupos/:id', (req, res) => {
        Grupo.findById(req.params.id, (err, grupo) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                console.log(grupo.eventos);
                grupo.eventos.sort(function (a, b) {
                    return new Date(b.start) - new Date(a.start);
                });
                res.json({ success: true, message: 'Grupos', grupo: grupo });
            }
        });
    });

    // CREATE GRUPO. (CREATE)
    router.post('/grupos/', (req, res) => {
        checkIfUserCanModifyGrupos(req, res, (err, result) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (result.success) {
                if (!req.body.nombre) {
                    res.json({ success: false, message: 'No se ha introducido un nombre' });
                } else {
                    let grupo = new Grupo({
                        nombre: req.body.nombre,
                        imagen: req.body.imagen,
                        informacion: req.body.informacion,
                        administrador: req.body.administrador,
                    });
                    if ("eventos" in req.body) {
                        grupo.eventos = req.body.eventos;
                    }
                    grupo.save((err) => {
                        if (err) {
                            res.json({ success: false, message: 'Error ' + err });
                        } else {
                            res.json({ success: true, message: 'Grupo añadido ' });
                        }
                    });
                }
            } else {
                res.json(result);
            }
        });
    });

    // (MODIFY)
    router.put('/grupos/:id', (req, res) => {
        checkIfUserCanModifyGrupos(req, res, (err, result) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (result.sucess) {
                if (!req.body.grupo) {
                    res.json({ success: false, message: 'No se ha especificado el objeto Grupo.' });
                } else {
                    Grupo.findByIdAndUpdate(req.params.id, req.body.grupo, (err) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, message: 'Grupo modificado correctamente' });
                        }
                    });
                }
            } else {
                res.json(result);
            }
        });
    });

    // (DELETE)
    router.delete('/grupos/:id', (req, res) => {
        checkIfUserCanModifyGrupos(req, res, (err, result) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (result.sucess) {
                Grupo.findByIdAndRemove(req.params.id, (err) => {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        res.json({ success: true, message: 'Grupo Eliminado correctamente' });
                    }
                });
            }
        });
    });

    router.post('/grupos/apuntarse', (req, res) => {
        if (!req.body.username || !req.body.idGrupo) {
            res.json({ success: false, message: 'Parametros invalidos.' });
        } else {
            Grupo.findById(req.body.idGrupo, (err, grupo) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    User.findOne({ username: req.body.username }).select('username').exec((err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else if (!user) {
                            res.json({ success: false, message: 'No existe el usuario en base de datos' });
                        } else {
                            if (!grupo.followers.find(obj => obj.name == req.body.username)) {
                                grupo.followers.push({ name: user.username });
                                grupo.save(err => {
                                    if (err) {
                                        res.json({ success: false, message: err });
                                    } else {
                                        res.json({ success: true, message: 'grupo (followers) actualizado(s) correctamente', grupo: grupo });
                                    }
                                })
                            } else {
                                res.json({ success: false, message: 'El usuario ya esta siguiendo el grupo.' });
                            }
                        }
                    });
                }
            });
        }
    });

    router.post('/grupos/desapuntarse', (req, res) => {
        if (!req.body.username || !req.body.idGrupo) {
            res.json({ success: false, message: 'Parametros invalidos.' });
        } else {
            Grupo.findById(req.body.idGrupo, (err, grupo) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    User.findOne({ username: req.body.username }).select('username').exec((err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else if (!user) {
                            res.json({ success: false, message: 'No existe el usuario en base de datos' });
                        } else {
                            let personaIndex = grupo.followers.findIndex(obj => obj.name == user.username);
                            if (personaIndex >= 0) {
                                grupo.followers.splice(personaIndex, 1);
                                grupo.save(err => {
                                    if (err) {
                                        res.json({ success: false, message: err });
                                    } else {
                                        res.json({ success: true, message: 'grupo (followers) actualizado(eliminado) correctamente', grupo: grupo });
                                    }
                                })
                            } else {
                                res.json({ success: false, message: 'El usuario no esta siguiendo el grupo' });
                            }
                        }
                    });
                }
            });
        }
    });

    return router;
};

checkIfUserCanModifyGrupos = function (req, res, callback) {
    console.log('holi?');
    if (!req.body.username) {
        console.log('esque le falta username?');
        return callback(null, { success: false, message: 'Parametros incorrectos para este tipo de peticion.' });
    } else {
        User.findOne({ username: req.body.username }, 'username role', (err, user) => {
            if (err) {
                console.log('Error al buscar usuario: ' + err);
                return callback(null, { success: false, message: err });
            } else if (!user) {
                console.log('Usuario no encontrado: ' + user);
                return callback(null, { success: false, message: 'Usuario no encontrado en la base de datos.' });
            } else if (user.role === 'admin') {
                console.log('Es admin, se admite todo: ' + user);
                return callback(null, { success: true });
            } else if (user.role === 'alumno') {
                console.log('Alumno no puede modificar: ' + user);
                return callback(null, { success: false, message: 'Permisos denegados para el rol de alumno' });
            } else {
                //Representante o parte del equipo?

                return Grupo.findOne({
                    _id: req.body.idGrupo,
                    $or: [
                        { administrador: user.username },
                        { equipo: user.username }
                    ]
                }, (err, grupo) => {
                    if (err) {
                        return callback(null, { success: false, message: 'Error en la busqueda de grupos.' });
                    } else if (!grupo) {
                        //Grupo no existe por lo tanto o se crea o el error aparecera en cada metodo individual
                        return callback(null, { success: true });
                    } else {
                        // On callback, solve the promise.
                        const result = !!user;
                        return callback(err, { success: result });
                    }
                });
            }
        });
    }
}
