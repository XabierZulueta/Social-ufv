const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const Evento = require('../models/Models.js').Evento;

module.exports = (router) => {

    router.post('/eventos/apuntarse', (req, res) => {
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

    router.post('/eventos/desapuntarse', (req, res) => {
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

    router.get('/eventos/', (req, res) => {
        Grupo.find({
            $and: [
                { "eventos": { $ne: [] } },
                { "eventos": { $exists: true } }]
        }, (err, grupos) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                let eventos = [];
                grupos.forEach(grupo => {
                    grupo.eventos.forEach(evento => {
                        let e = evento.toObject();
                        e.grupo = {
                            _id: grupo._id,
                            nombre: grupo.nombre
                        }
                        eventos.push(e);
                    });
                });
                res.json({ success: true, message: 'Eventos', eventos: eventos });
            }
        });
    });

    /* 
        Borrar un evento.
        @param idGrupo: Necesitamos el id del grupo para obtener el grupo al que pertenece un evento.
                        Un evento puede ser identico en varios grupos.
        @body param: El evento que se va a borrar. (Con el titulo vale.).
    */
    router.delete('/eventos/delete/:idGrupo/:title', (req, res) => {
        Grupo.findByIdAndUpdate(
            req.params.idGrupo,
            { $pull: { "eventos": { title: req.params.title } } }
            , (err, grupos) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, message: 'Evento actualizado.' });
                }
            });
    });

    return router;
};
