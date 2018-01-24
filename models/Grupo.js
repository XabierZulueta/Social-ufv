/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

var EventSchema = new mongoose.Schema({
  title: {type:String, required: true},
  organizador: String,
  description: String,
  creditos: Number,
  maxPersonas: Number,
  apuntados:[String],
  checked: [String],
  status: {
    type: String,
    enum: ['open', 'full', 'close', 'pending'],
    required: true,
    default: 'open',
    lowercase: true,
  },
  updated_at: { type: Date, default: Date.now },
  start: Date,
  end: Date,
  color: String,
});

var GrupoSchema = new mongoose.Schema({
  nombre: {type:String, unique:true},
  imagen: String,
  administrador: String,
  equipo: [String],
  eventos: [{type: EventSchema, unique:true}],
});

 
// Export Module/Schema
module.exports = mongoose.model('Grupo', GrupoSchema);