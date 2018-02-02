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

    // CRUD

    // GET ALL (READ)
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
        DELETE BY TITLE(ID) (DELETE)
        Borrar un evento.
        @param idGrupo: Necesitamos el id del grupo para obtener el grupo al que pertenece un evento.
                        Un evento puede ser identico en varios grupos.
        @body param: El evento que se va a borrar. (Con el titulo vale.).
    */
    router.delete('/eventos/:idGrupo/:title', (req, res) => {
        Grupo.findByIdAndUpdate(
            req.params.idGrupo,
            { $pull: { "eventos": { title: req.params.title } } }
            , (err) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    console.log(req.user);
                    res.json({ success: true, message: 'Evento eliminado correctamente.' });
                }
            });
    });

    // CREATE (CREATE)
    router.post('/eventos/:idGrupo', (req, res) => {
        if (!req.params.idGrupo) {
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

                // No se ha usado .update porque se quiere comprobar que el titulo del evento no exista para ese grupo.

                Grupo.findById(req.params.idGrupo, (err, grupo) => {
                    if (err) {
                        res.json({ success: false, message: 'Err' })
                    } else if (!grupo) {
                        res.json({ success: false, message: 'Grupo No encontrado.' })
                    } else if (grupo.eventos.findIndex(obj => obj.title === evento.title) !== -1) {
                        res.json({ success: false, message: 'No se puede insertar un titulo duplicado' });
                    } else {
                        grupo.eventos.push(evento);
                        grupo.save((err) => {
                            if (err) {
                                res.json({ success: false, message: 'Err' });
                            } else {
                                res.json({ success: true, message: 'Grupo aniadido' })
                            }
                        });
                    }
                });
            }
        }
    });

    // PUT (MODIFY)
    /* BODY EXAMPLE:
        {
            title: '123 al escondite ingles',
            evento: { Object con el evento y los parametros que se quieran cambiar}
        }
    */
    router.put('/eventos/:idGrupo/', (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'No se ha especificado el titulo del evento que se quiere modificar.' });
        } else {
            Grupo.find({ _id: req.params.idGrupo, "eventos.title": req.body.title }, (err, grupo) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else if (!grupo) {
                    res.json({ success: false, message: 'grupo no encontrado' });
                } else {
                    const evIndex = grupo.eventos.findIndex(obj => obj.title === req.body.title);
                    const eventoModificado = new Evento(req.body.evento);
                    grupo.eventos[evIndex] = eventoModificado;
                    grupo.save(err => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, message: 'Evento modificado correctamente.' });
                        }
                    })
                }
            })
        }
    });

    return router;
};
