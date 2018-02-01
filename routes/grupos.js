const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const Evento = require('../models/Models.js').Evento;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (router) => {
    router.get('/allGrupos', (req, res) => {
        Grupo.find({}, (err, grupos) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            res.json({ success: true, message: 'Grupos', grupos: grupos });
        })
    });

    router.post('/grupo/:id/addEvento', (req, res) => {
        if (!req.params.id) {
            console.log('falta id');
            res.json({ success: false, message: 'Id incorrecto.' });
        } else if (!req.body.evento) {
            console.log('falta evento');
            res.json({ success: false, message: 'No se ha seleccionado evento.' });
        } else {
            console.log('CreandoEvento');
            let evento = new Evento(req.body.evento);
            console.log(evento);
            if (!evento.title) {
                console.log('falta titulo');
                res.json({ success: false, message: 'Nombre del evento obligatorio.' });
            } else if (!evento.start) {
                console.log('falta start');
                res.json({ success: false, message: 'Fecha de comienzo del evento obligatoria.' });
            } else {
                console.log('Evento Aniadido al grupo.(supongo');
                Grupo.findById(req.params.id, (err, grupo) => {
                    if (err) {
                        console.log(err);
                        res.send({ success: false, message: 'Err' })
                    } else if (!grupo) {
                        res.send({ success: false, message: 'Grupo No encontrado.' })
                    } else if (grupo.eventos.findIndex(obj => obj.title === evento.title) !== -1) {
                        res.send({ success: false, message: 'No se puede insertar un titulo duplicado' });
                    } else {
                        grupo.eventos.push(evento);
                        grupo.save((err) => {
                            if (err) {
                                res.send({ success: false, message: 'Err' });
                            } else {
                                res.send({ success: true, message: 'Grupo aniadido' })
                            }
                        });
                    }
                });
            }
        }
    });

    router.get('/getGrupo/:id', (req, res) => {
        Grupo.findById(req.params.id, (err, grupo) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, message: 'Grupos', grupo: grupo });
            }
        });
    });

    router.post('/grupo/', (req, res) => {
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
            console.log(grupo);
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
    });

    return router;
}