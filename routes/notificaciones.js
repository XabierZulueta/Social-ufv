const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;
const Evento = require('../models/Models.js').Evento;

function containsElementByName(array, object){
    array.forEach(data => {
        if(data.name == object) {
            return true;
        }
    });
    return false;
}

module.exports = (router) => {
    router.get('/eventos', (req, res) => {
        let grupo = new Grupo({
            nombre: 'Grupo 4',
            administrador: 'Manza',
            equipo: ['Xabier Zulueta', 'Jorge Manzanares'],
            eventos:[],
        });
        grupo.eventos.push(new Evento({
            title: 'Evento 4',
            organizador: 'Otro admin distinto',
            descripcion: 'desc',
            creditos: 10,
            status: 'PeNdInG',
            maxPersonas: 500,
            go: grupo.equipo.concat('Xabier Zulueta'),
            checked: [],
        }));
        grupo.save(err => {
            if (err){
                res.json({message: err, success: false}); 
            } else {
                res.json({message: "Grupo aniadido!", success: true}); 
            }
        });
    });

    router.get('/test/eventos/confirmarAsistencia/:nombre', (req, res) => {
        let eventsArray= [];
        console.log(req.params.nombre);
        Grupo.find({'eventos.status': 'pending', $or: [{'administrador': req.params.nombre}, {'eventos.equipo' : req.params.nombre }]}).exec((err,data) => {
            if(err){
                res.json({success:false, message:err});
            } else {
                res.json({success:true , message:"grupos", grupos:data});
            }
        })
    });

    router.put('/test/eventos/confirmarAsistencia/', (req, res) => {
        if(!req.body.grupo || !req.body.evento || !req.body.usuario || !req.body.confirmacion){
            res.json({success: false, message: 'Parametros incorrectos.'})
        } else {
            let creditosConseguidos = 0;
            let userRegister = false;
            Grupo.findOne({'nombre': req.body.grupo }, (err, grupo)=>{
                if(err){ res.json({success:false, message: err})}
                else if(grupo) {
                    grupo.eventos.forEach(evento => {
                        if(evento.checked.includes(req.body.usuario)){
                            userRegister=true;
                        }
                        if(evento.title === req.body.evento && evento.go.includes(req.body.usuario) && !evento.checked.includes(req.body.usuario)){
                            creditosConseguidos = evento.creditos;
                            evento.checked.push({'name':req.body.usuario, 'confirmed':req.body.confirmacion});
                        }
                        if(evento.go.length === evento.checked.length) {
                            evento.status = 'close';
                        }
                    });
                    if(userRegister){
                        res.json({success:false, message:'El usuario ya ha sido registrado en la base de datos.'});
                    } else{
                        User.findOne({name: req.body.usuario}, (err, user)=>{
                            if(err){
                                res.json({success:false, message:err});
                            } else if (!user) {
                                //Usuario no encontrado.
                                creditosConseguidos = 0;
                                console.log('');
                            } else {
                                creditosConseguidos += user.creditos;
                                console.log('');
                            }
                        } );
                        grupo.eventos.forEach(evento => {
                            console.log(evento.checked);
                        } )
                        grupo.save( err => {
                            if(err){
                                res.json({success:false, message:err});
                            } else if (creditosConseguidos !== 0) {
                                User.findOneAndUpdate({name: req.body.usuario}, {
                                    creditos: creditosConseguidos
                                }, function(err, numberAffected, rawResponse) {
                                    if(!err) {
                                        res.json({success:true, message:'Grupo actualizado'});
                                    }
                                });
                            } else {
                                res.json({success:true, message:'No se han actualizado los creditos'});
                            }
                        });
                    }
                } else {
                    res.json({success:false, message:'El nombre del grupo no existe en la base de datos.'});
                }
            });


        // Grupo.find({'eventos.status': 'close'}).exec((err,data) => {
        //     if(err){
        //         res.json({success:false, message:err});
        //     } else {
        //         data.forEach(grupo => {
        //             grupo.eventos.forEach(evento =>{
        //                 if(evento.start > new Date(2000, 10, 10) && evento.go.length !== evento.checked.length){
        //                     eventsArray = eventsArray.concat(evento);
        //                 }
        //             });
        //             console.log("next");
        //         });
        //         res.json({success:true, message:"eventos only", eventos:eventsArray});
        //     }
        // })
        }
    });

    return router;
};