const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const Evento = require('../models/Models.js').Evento;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (router) => {
    // CRUD OPERATIONS:
    // GET ALL (READ)

    router.get('/grupos/test1', (req, res) => {
        res.send('holi test');
    });

    router.get('/grupos', (req, res) => {
        Grupo.find({}, (err, grupos) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            res.json({ success: true, message: 'Grupos', grupos: grupos });
        })
    });

    // GET ONE BY ID (READ)
    router.get('/grupos/:id', (req, res) => {
        Grupo.findById(req.params.id, (err, grupo) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, message: 'Grupos', grupo: grupo });
            }
        });
    });

    // CREATE GRUPO. (CREATE)
    router.post('/grupos/', (req, res) => {
        checkIfUserCanModify(req, res, (err, result) => {
            if (err) {
                res.json({ success: false, message: err });
            } else if (result.sucess) {
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
                            console.log(err);
                            res.json({ success: false, message: 'Error ' + err });
                        } else {
                            console.log(grupo);
                            res.json({ success: true, message: 'Grupo añadido ' });
                        }
                    })
                }
            }
        });
    });

    // (MODIFY)

    router.put('/grupos/:id', (req, res) => {
        checkIfUserCanModify(req, res, (err, result) => {
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
        checkIfUserCanModify(req, res, (err, result) => {
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

    return router;
}
// If error, return the json to send to the response.
// {success:T/F, message: string }
const checkIfUserCanModify = (req, res, callback) => {
    if (!req.body.username) {
        return callback(null, { success: false, message: 'No se ha especificado usuario.' });
    } else {
        User.findOne({ username: req.body.username }, 'username role', (err, user) => {
            if (err) {
                return callback(null, { success: false, message: err });
            } else if (!user) {
                return callback(null, { success: false, message: 'Usuario no encontrado en la base de datos.' });
            } else if (user.role === 'admin') {
                return callback(null, { success: true });
            } else if (user.role === 'alumno') {
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
                    // On callback, solve the promise.
                    const result = !!user;
                    callback(err, { success: grupo });
                });
            }
        });
    }
};