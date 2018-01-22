const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GrupoSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  nombre: String,
  organizador: String,
  eventos: [{type: Schema.Types.ObjectId, ref: 'Event'}],
});

var EventSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  organizador: String,
  description: String,
  creditos: Number,
  grupo: { type: Schema.Types.ObjectId, ref: 'Grupo' },
  updated_at: { type: Date, default: Date.now },
});

module.exports = {Evento: mongoose.model('Event', EventSchema),
                  Grupo:  mongoose.model('Grupo', GrupoSchema)};
