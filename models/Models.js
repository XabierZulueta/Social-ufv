const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizador: String,
  description: String,
  creditos: Number,
  maxPersonas: Number,
  go: [{ name: { type: String, required: true }, confirmed: { type: Boolean } }],
  status: {
    type: String,
    enum: ['open', 'full', 'close', 'pending'],
    required: true,
    default: 'open',
    lowercase: true,
  },
  start: { type: Date, required: true, default: Date.now },
  end: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

var GrupoSchema = new mongoose.Schema({
  nombre: { type: String, unique: true },
  imagen: String,
  administrador: String,
  equipo: [String],
  eventos: [{ type: EventSchema }],
  followers: [String]
});

module.exports = { Grupo: mongoose.model('Grupo', GrupoSchema), Evento: mongoose.model('Evento', EventSchema) };

