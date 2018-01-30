var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Evento = require('../models/Models.js').Evento;
var Grupo = require('../models/Models.js').Grupo;

/* GET ALL Eventos */
// router.get('/', function (req, res, next) {

//     Grupo.find({"eventos.description": "Descripcion del evento"}).populate('eventos').exec(function (err, grupo) {
//         if (err) return next(err);
//         res.json(grupo);
//         console.log(grupo);
//     });

//     // Evento.find({title:"String"}).populate('grupo').exec(function (err, evento) {
//     //     if (err) return next(err);
//     //     res.json(evento);
//     //     console.log(evento);
//     // });
// });

// /* GET SINGLE Evento BY ID */
// router.get('/:id', function (req, res, next) {
//     Evento.findById(req.params.id).populate('grupo').exec(function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

// /* SAVE Evento */
// router.post('/', function (req, res, next) {
//     Evento.create(req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

// /* UPDATE Evento */
// router.put('/:id', function (req, res, next) {
//     Evento.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

// /* DELETE Evento */
// router.delete('/:id', function (req, res, next) {
//     Evento.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

module.exports = router;