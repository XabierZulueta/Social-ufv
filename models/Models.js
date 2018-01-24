const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
  title: {type:String, required: true},
  organizador: String,
  description: String,
  creditos: Number,
  maxPersonas: Number,
  go:[String],
  checked: [String],
  status: {
    type: String,
    enum: ['open', 'full', 'close', 'pending'],
    required: true,
    default: 'open',
    lowercase: true,
  },
  updated_at: { type: Date, default: Date.now },
});

var GrupoSchema = new mongoose.Schema({
  nombre: {type:String, unique:true},
  imagen: String,
  administrador: String,
  equipo: [String],
  eventos: [{type: EventSchema, unique:true}],
});

module.exports = {Evento: mongoose.model('Event', EventSchema),
                  Grupo:  mongoose.model('Grupo', GrupoSchema)};

