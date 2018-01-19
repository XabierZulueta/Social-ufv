const User = require('../models/Models.js').User;

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
                    })
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
    return router;
} 