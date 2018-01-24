const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const config = require('./../config/config.dev');

module.exports = (router) =>{

    router.post('/register', (req, res) =>{
        if(!req.body.email){
            res.json({message: "Sent malphormed EMAIL", success:false}); 
        } else {
            if(!req.body.username){
                res.json({message: "Sent malphormed USERNAME", success:false}); 
            } else{
                if(!req.body.password){
                    res.json({message: "Sent malphormed PASSWORD", success:false}); 
                }else {
                    let user = new User({
                        username: req.body.username.toLowerCase(),
                        email: req.body.email.toLowerCase(),
                        password: req.body.password
                    });
                    user.save((err) =>{
                        if (err){
                            if(err.code === 11000) {
                                res.json({message: "User or email already exists", success: false});
                            } else if (err.errors) {
                                if(err.errors.email){
                                    res.json({message: err.errors.email.message, success: false}); 
                                } else if(err.errors.username) {
                                    res.json({message: err.errors.username.message, success: false}); 
                                } else if(err.errors.password) {
                                    res.json({message: err.errors.password.message, success: false}); 
                                }
                            }
                        } else {
                            res.json({message: "Voila!", success: true}); 
                        }
                    });
                }
            }
        }
    });

    router.get('/checkEmail/:email', (req, res) => {
        console.log('email');
        if(!req.params.email){
            res.json({success:false, message: "No se ha especificado e-mail."});
        } else {
            User.findOne({ email: req.params.email.trim() }, (err, usr)=> {
                if(err){
                    res.json({success:false, message: err });
                } else {
                    if(usr){
                        res.json({message: "El email ya ha sido registrado!", success: false}); 
                    } else{
                        res.json({message: "Email disponible ", success: true}); 
                    }
                }
            });
        }
    });

    router.get('/checkUsername/:username', (req, res) => {
        console.log('username');
        if(!req.params.username){
            res.json( {success:false, message: "No se ha especificado e-mail."} );
        } else {
            console.log('Authentication.js: \'' + req.params.username + '\'');
            User.findOne({ username:req.params.username }, (err, usr)=> {
                if(err){
                    res.json({success:false, message: err });
                } else {
                    if (usr) {
                        res.json({message: "El nombre de usuario ya ha sido registrado!", success: false}); 
                    } else {
                        res.json({message: "Nombre de usuario disponible ", success: true}); 
                    }
                }
            });
        }
    });
 
    router.post('/login', (req, res) =>{
        if(!req.body.username){
            res.json({message: "No se ha seleccionado ningun nombre de usuario", success:false}); 
        } else if(!req.body.password){
            res.json({message: "No se ha proporcionado contraseña", success:false}); 
        }else {
            User.findOne({username: req.body.username.toLowerCase()}, (err, user) =>{
                if(err){
                    res.json({success:false, message: err});
                } else if (!user) {
                    res.json({success:false, message: "Usuario no existente."});
                } else { 
                    const pssOk = user.comparePassword(req.body.password);
                    if (!pssOk) {
                        res.json({success:false, message: "Usuario o contraseña incorrectos."});
                    } else {
                        const token = jwt.sign({userid: user._id}, config.secret, {expiresIn: '24h'});
                        res.json({success:true, message: "Bienvenido "+user.username, token:token, user: {username: user.username}});
                    }
                }
            }
        );
        }
    });


    return router;
};