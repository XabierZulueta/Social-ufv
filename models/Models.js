const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailChecker = (email) => {
  if(!email) return false;
  if(email.length < 5 || email.length > 30) return false;
    return true;
}

let validAtEmailChecker = (email) => {
  if(!email) return false;
  const regEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  return regEx.test(email);
}

let usernameChecker = (username) => {
  if(!username) return false;
  if(username.length < 5 || username.length > 30) return false;
    return true;
}

let validUsernameChecker = (username) => {
  if(!username) return false;
  const regEx = new RegExp(/^[a-zA-Z0-9]+$/);
  return regEx.test(username);
}

let passwordChecker = (password) => {
  if(!password) return false;
  if(password.length < 5 || password.length > 15) return false;
    return true;
}

let validPasswordChecker = (password) => {
  if(!password) return false;
  const regEx = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
  return regEx.test(password);
}

const usernameValidator = [
  {
    validator: usernameChecker,
    message: 'Username tiene que ser mayor de 5 caracteres y menor que 30'
  },
  {
    validator: validUsernameChecker,
    message: 'Username no puede contener caracteres especiales.'
  }
]

const passwordValidator = [
  {
    validator: passwordChecker,
    message: 'La contraseña tiene que ser mayor de 5 caracteres y menor que 30'
  },
  {
    validator: validPasswordChecker,
    message: 'La contraseña introducida no es correcta.'
  }
]

const emailValidator = [
  {
    validator: emailChecker,
    message: 'Email tiene que ser mayor de 5 caracteres y menor que 15'
  },
  {
    validator: validAtEmailChecker,
    message: 'El email introducido no es correcto.'
  }
]

const UserSchema = new Schema({
  email:{type:String, required:true, unique:true, lowercase:true, validate: emailValidator },
  username:{type:String, required:true, unique:true, lowercase:true, validate: usernameValidator},
  password:{type:String, required:true, validate: passwordValidator},
});

UserSchema.pre('save', function(next) {
  if(!this.isModified('password')) return next();
  bcrypt.hash(this.password, null, null, (err, hash) =>{
    if(err) return next(err);
    this.password =  hash;
    next();
  });
});

UserSchema.methods.comparePasswords = (password) => {
  return bcrypt.compareSync(password, this.password);
}

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
                  Grupo:  mongoose.model('Grupo', GrupoSchema),
                  User:   mongoose.model('User',  UserSchema)};
