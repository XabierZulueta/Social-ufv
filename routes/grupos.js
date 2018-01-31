const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const Evento = require('../models/Models.js').Evento;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (router) => {
    router.get('/', (req, res) => {
        Grupo.find({}, (err, grupos) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            res.json({ success: true, message: 'Grupos', grupos: grupos });
        })
    });

    router.get('/eventos', (req, res) => {
        Grupo.find({}).select('eventos').exec((err, grupos) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            res.json({ success: true, message: 'Grupos', grupos: grupos });
        });
    });

    router.get('/:id', (req, res) => {
        Grupo.findById(req.params.id, (err, grupo) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, message: 'Grupos', grupo: grupo });
            }
        });
    });

    router.post('/', (req, res) => {
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
            })
        }
    });

    return router;
}