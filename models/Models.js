const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizador: String,
  description: String,
  creditos: Number,
  maxPersonas: Number,
  go: [{ name: { type: String, required: true }, confirmed: Boolean, message: String }],
  status: {
    type: String,
    enum: ['open', 'full', 'close', 'pending'],
    required: true,
    default: 'open',
    lowercase: true,
  },
  start: { type: Date, required: true, default: Date.now },
  end: { type: Date },
  updated_at: { type: Date, default: Date.now },
});

var GrupoSchema = new mongoose.Schema({
  nombre: { type: String, unique: true },
  imagen: String,
  administrador: String,
  equipo: [String],
  eventos: [{ type: EventSchema }],
  followers: [{ name: { type: String, required: true }, confirmed: { type: Boolean } }],
  tags: [{ type: String, lowercase: true }],
  informacion: String
});

GrupoSchema.pre('save', function (next) {
  User.findOne({ username: this.administrador }, (err, user) => {
    if (err) {
      next(new Error('Se ha producido un error' + err.message));
    } else if (!user) {
      next(new Error('Ese administrador no esta registrado en el sistema'));
    } else {
      next();
    }
  });
});

module.exports = { Grupo: mongoose.model('Grupo', GrupoSchema), Evento: mongoose.model('Evento', EventSchema) };

