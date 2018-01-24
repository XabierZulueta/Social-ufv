const User = require('../models/User.js');
const Grupo = require('../models/Grupo.js');
const jwt = require('jsonwebtoken');
const config = require('./../config/config.dev');

module.exports = (router) =>{
    router.get('/', (req, res)=>{
        Grupo.find({}, (err, grupos) => {
            if(err){
                res.send('error');
            }
            res.send(grupos);
        })
    });

    router.get('/eventos', (req, res)=>{
        Grupo.find({}).select('eventos').exec((err, grupos) => {
            if(err){
                res.send('error');
            }
            res.json(grupos);
        });
    });

    router.post('/', (req, res)=>{
        if (!req.body.nombre) {
            res.json({success:false, message: 'No se ha introducido un nombre'});
        } else {
            const grupo = new Grupo({
                nombre: req.body.nombre,
                imagen: req.body.imagen,
                informacion: req.body.informacion,
                administrador: req.body.administrador,
            });
            grupo.save((err) => {
                if (err) {
                    res.json({success:false, message: 'Error '+err});
                } else {
                    res.json({success:true, message: 'Grupo añadido '});
                }
            })
        }
    });
    return router;
}