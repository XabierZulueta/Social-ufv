const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const Evento = require('../models/Models.js').Evento;

module.exports = (router) => {

    router.post('/apuntarse', (req, res) => {
        if (!req.body.username || !req.body.idGrupo || !req.body.evento) {
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
                            let eventoIndex = grupo.eventos.findIndex(obj => obj.title == req.body.evento);
                            console.log(grupo.eventos[eventoIndex]);
                            if (!grupo.eventos[eventoIndex].go.find(obj => obj.name == req.body.username)) {
                                grupo.eventos[eventoIndex].go.push({ name: user.username });
                                grupo.save(err => {
                                    if (err) {
                                        res.json({ success: false, message: err });
                                    } else {
                                        res.json({ success: true, message: 'grupo actualizado correctamente', grupo: grupo });
                                    }
                                })
                            } else {
                                res.json({ success: false, message: 'El usuario ya esta apuntado al evento.' });
                            }
                        }
                    });
                }
            });
        }
    });

    router.post('/desapuntarse', (req, res) => {
        if (!req.body.username || !req.body.idGrupo || !req.body.evento) {
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
                            let eventoIndex = grupo.eventos.findIndex(obj => obj.title == req.body.evento);
                            let personaIndex = grupo.eventos[eventoIndex].go.findIndex(obj => obj.name == user.username);
                            console.log(grupo.eventos[eventoIndex]);
                            if (personaIndex >= 0) {
                                grupo.eventos[eventoIndex].go.splice(personaIndex, 1);
                                grupo.save(err => {
                                    if (err) {
                                        res.json({ success: false, message: err });
                                    } else {
                                        res.json({ success: true, message: 'grupo actualizado correctamente', grupo: grupo });
                                    }
                                })
                            } else {
                                res.json({ success: false, message: 'El usuario no estaba apuntado al evento.' });
                            }
                        }
                    });
                }
            });
        }
    });

    return router;
};