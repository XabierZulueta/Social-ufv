const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const Evento = require('../models/Models.js').Evento;

function containsElementByName(array, object) {
    array.forEach(data => {
        if (data.name == object) {
            return true;
        }
    });
    return false;
}

module.exports = (router) => {

    router.get('/notificaciones/eventos/confirmarAsistencia/:nombre', (req, res) => {
        let eventsArray = [];
        // Grupo.find({'eventos.status': 'pending', $or: [{'administrador': req.params.nombre}, {'eventos.equipo' : req.params.nombre }]}).exec((err,data) => {
        //     if(err){
        //         res.json({success:false, message:err});
        //     } else {
        //         res.json({success:true , message:"grupos", grupos:data});
        //     }
        // })

        Grupo.find({}).exec((err, data) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, message: "grupos", grupos: data });
            }
        });
    });

    router.put('/notificaciones/eventos/confirmarAsistencia/', (req, res) => {
        if (!req.body.grupo || !req.body.evento || !req.body.usuario || !("confirmacion" in req.body)) {
            if (!req.body.grupo) {
                res.json({ success: false, message: 'Grupo Incorrecto.' });
            }
            if (!req.body.evento) {
                res.json({ success: false, message: 'Evento incorrecto.' });
            }
            if (!req.body.usuario) {
                res.json({ success: false, message: 'usuario Incorrecto.' });
            }
            if (req.body.confirmacion) {
                res.json({ success: false, message: 'Confirmacion Incorrecto.' });
            }
        } else {
            let creditosConseguidos = 0;
            let userRegister = false;
            /* {
                'nombre': req.body.grupo ,
                $and: [
                {"eventos": {$ne: [], $exists:true}},
                {"eventos.go": {
                    $exists:true, 
                    $ne: [],
                    $elemMatch: {"confirmed": {$exists:false}}
                }}
                ]
            }
            */
            Grupo.findOne({ 'nombre': req.body.grupo }, (err, grupo) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else if (grupo) {
                    const eventIndex = grupo.eventos.findIndex(obj => obj.title === req.body.evento);
                    if (eventIndex !== -1) {
                        console.log(grupo.eventos[eventIndex]);
                        const personIndex = grupo.eventos[eventIndex].go.findIndex(obj => obj.name === req.body.usuario);
                        if (personIndex !== -1) {
                            if (typeof grupo.eventos[eventIndex].go[personIndex].confirmed === 'undefined') {
                                grupo.eventos[eventIndex].go[personIndex].confirmed = req.body.confirmacion;

                                User.findOne({ name: req.body.usuario }).select('creditos').exec((err, user) => {
                                    if (err) {
                                        res.json({ success: false, message: err });
                                    } else if (!user) {
                                        creditosConseguidos = 0;
                                        next();
                                    } else {
                                        creditosConseguidos += user.creditos;
                                        console.log();
                                    }
                                });
                                grupo.save(err => {
                                    if (err) {
                                        res.json({ success: false, message: err });
                                    } else if (creditosConseguidos !== 0) {
                                        User.findOneAndUpdate({ name: req.body.usuario }, {
                                            creditos: creditosConseguidos
                                        }, function (err, numberAffected, rawResponse) {
                                            if (!err) {
                                                res.json({ success: true, message: 'Grupo y usuario actualizados', grupo: grupo });
                                            }
                                        });
                                    } else {
                                        res.json({ success: true, message: 'No se ha actualizado el usuario.', grupo: grupo });
                                    }
                                });
                            } else {
                                res.json({ success: false, message: 'este usuario ya ha sido registrado' });
                                return;
                            }
                            console.log(grupo.eventos[eventIndex].go);
                        }
                    }
                } else {
                    res.json({ success: false, message: 'Error: Grupo no existe. "notificaciones.js" ' });
                }
            });
        }
    });

    return router;
};