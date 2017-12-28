const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const multer = require('multer');
var jwt = require('jwt-simple');
/*
    SECCION SUBIDA DE FICHEROS
*/
var storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
        cb(null, './dist/assets/uploads/');
        //EXPLICAR A MANZA
        cb(null,'./src/assets/uploads/' )
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

router.post("/upload", upload.array("uploads[]", 12), function (req, res) {
    res.send(req.files);
});

/*QUERIES

    db.users.find().sort({id:-1}).limit(1)//RECUPERA EL USUARIO CON MAYOR ID

    */

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://xabier:xabier@ds159274.mlab.com:59274/social-ufv',(err,db) => {
    //return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

//get Groups by tags
router.get('/groups/tags', (req, res) => {
    connection((db) => {
        db.collection('grupos')
            .find( { "tags": { $in: req.body } })
            .toArray()
            .then((tag) => {
                response.data = tag;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    })
});


// Get tags
router.get('/tags', (req, res) => {
    connection((db) => {
        db.collection('tags')
            .find()
            .sort({'descripcion':1})
            .toArray()
            .then((tags) => {
                response.data = tags;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

//Ver si está esperando la petición.
router.get('/peticiones/miembro/:idUsuario/:idGrupo', (req,res)=>{
    var idUsuario = req.params.idUsuario;
    idUsuario = parseInt(idUsuario);
    var idGrupo = req.params.idGrupo;
    idGrupo = parseInt(idGrupo);
    connection((db) => {
        db.collection('peticiones')
            .findOne({ idUsuario: idUsuario, idGrupo:idGrupo })
            .then((user) => {
                    response.data = user;
                    res.json(response);
                })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

//POst peticiones
router.post('/peticiones', (req, res) => {
    connection((db) => {
        db.collection('peticiones')
            .insert(req.body, function (err, result) {
                if (err)
                    res.send('Error');
                else
                    res.send('Success');
            });
        db.close();
    })
});

//Delete peticion
router.delete('/peticiones/:id', (req, res) => {
    var id = req.params.id;
    id = parseInt(id);
    var objeto = { id: id };
    connection((db) => {
        db.collection('peticiones')
            .deleteOne(objeto, function (err, result) {
                if (err)
                    res.send('Error');
                else
                    res.send('Success');
            });
        db.close();
    });
});

//Get npeticiones by group
router.get('/grupo/:id/npeticiones' , (req, res) => {
    var id = req.params.id;
    id = parseInt(id);
    connection((db) => {
        db.collection('peticiones')
            .count({ idGrupo: Number(id) })
            .then((nusers) => {
                response.data = nusers;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    })
});

// Get peticiones by groupId
router.get('/peticiones/:id', (req, res) => {
    var idGrupo = req.params.id;
    connection((db) => {
        db.collection('peticiones')
            .find({ idGrupo: Number(idGrupo) })
            .toArray()
            .then((user) => {
                response.data = user;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

//get events like(, sin diferenciar entre mayusculas y minusculas
router.get('/events/nombre/:nombre', (req, res) => {
    var nombre = req.params.nombre;
    connection((db) => {
        db.collection('events')
            .find({ 'title': { $regex: nombre, $options: 'i' } })
            .sort({ 'title': 1 })
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });

    });
});


//get grupos like, sin diferenciar entre mayusculas y minusculas
router.get('/groups/nombre/:nombre', (req, res) => {
    var nombre = req.params.nombre;
    connection((db) => {
        db.collection('grupos')
            .find({ 'nombre': { $regex: nombre, $options: 'i' } })
            .sort({ 'nombre': 1 })
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });

    });
});

//get users like, sin diferenciar entre mayusculas y minusculas
router.get('/users/nombre/:nombre', (req,res) => {
    var nombre = req.params.nombre;
    connection((db)=>{
        db.collection('users')
        .find({'name': {$regex : nombre, $options : 'i'} })
        .sort({'name':1})
        .toArray()
        .then((users) => {
            response.data = users;
            res.json(response);
        })
        .catch((err) => {
            sendError(err, res);
        });
        
    });
});

//Apuntarse a un evento
router.post('/apuntarEvento/:idUsuario/:idEvento', (req, res) => {
    var idUsuario = req.params.idUsuario;
    idUsuario = parseInt(idUsuario);
    var idEvento = req.params.idEvento;
    idEvento = parseInt(idEvento);
    connection((db) => {
        db.collection('events')
            .update({ id: idEvento }, { $addToSet: { apuntados: idUsuario } });
        db.close();
    });
});
//Desapuntarse de un evento
router.post('/desapuntarEvento/:idUsuario/:idEvento', (req, res) => {
    var idUsuario = req.params.idUsuario;
    idUsuario = parseInt(idUsuario);
    var idEvento = req.params.idEvento;
    idEvento = parseInt(idEvento);
    connection((db) => {
        db.collection('events')
            .update({ id: idEvento }, { $pull: { apuntados: idUsuario } });
        db.close();
    });
});

//Apuntarse a un grupo
router.post('/apuntar/:idUsuario/:idGrupo', (req, res) => {
    var idUsuario = req.params.idUsuario;
    idUsuario = parseInt(idUsuario);
    var idGrupo = req.params.idGrupo;
    idGrupo = parseInt(idGrupo);
    connection((db) => {
        db.collection('users')
            .update({ id: idUsuario }, { $addToSet: { grupos: idGrupo } });
        db.close();
    });
});
//Desapuntarse de un grupo
router.post('/desapuntar/:idUsuario/:idGrupo', (req, res) => {
    var idUsuario = req.params.idUsuario;
    idUsuario = parseInt(idUsuario);
    var idGrupo = req.params.idGrupo;
    idGrupo = parseInt(idGrupo);
    connection((db) => {
        db.collection('users')
            .update({ id: idUsuario }, { $pull: { grupos: idGrupo } });
        db.close();
    });
});

//Ver si está apuntado a un evento
router.get('/user/apuntado/:idUsuario/:idEvento', (req, res) => {
    var idUsuario = req.params.idUsuario;
    idUsuario = parseInt(idUsuario);
    var idEvento = req.params.idEvento;
    idEvento = parseInt(idEvento);
    connection((db) => {
        db.collection('events')
            .findOne({ id: idEvento, apuntados: idUsuario })
            .then((user) => {
                response.data = user;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

//Ver si está apuntado a un grupo.
router.get('/user/miembro/:idUsuario/:idGrupo', (req,res)=>{
    var idUsuario = req.params.idUsuario;
    idUsuario = parseInt(idUsuario);
    var idGrupo = req.params.idGrupo;
    idGrupo = parseInt(idGrupo);
    connection((db) => {
        db.collection('users')
            .findOne({ id: idUsuario, grupos:idGrupo })
            .then((user) => {
                    response.data = user;
                    res.json(response);
                })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

//Get nusers by group
router.get('/grupo/:id/nusers' , (req, res) => {
    var id = req.params.id;
    id = parseInt(id);
    connection((db) => {
        db.collection('users')
            .count({ grupos: Number(id) })
            .then((nusers) => {
                response.data = nusers;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    })
});

//Authenticate
router.post('/authenticate', (req,res)=>{
    connection((db) => {
        db.collection('users')
            .findOne({ name: req.body.username, password: req.body.password  },function(err,user){
                if(err) throw err;
                if(!user){
                    res.json({success:false, msg:'Los datos introducidos no coinciden.'});
                }
                else
                {
                    var token = jwt.encode(user, 'xxx','HS512');
                    res.json({ success: true, msg: 'Ese usuario si existe', user:user, token:token});
                }
            })
            ;
        db.close();
    });
});

// New Group
router.post('/groups', (req, res) => {
    req.body.id = parseInt(req.body.id);
    connection((db) => {
        db.collection('grupos')
            .insert(req.body, function (err, result) {
                if (err)
                    res.send('Error');
                else
                    res.send('Success');
            });
        db.close();
    })
});
//Get users by group id
router.get('/users/grupo/:id' , (req, res) => {
    var id = req.params.id;
    id = parseInt(id);
    var objeto = { id: id };
    connection((db) => {
        db.collection('users')
            .find({ grupos: Number(id) })
            .toArray()
            .then((user) => {
                response.data = user;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    })
});

// Get group max id
router.get('/groups/max', (req, res) => {
    connection((db) => {
        db.collection('grupos')
            .find({})
            .sort({ "id": -1 })
            .limit(1)
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

// Get events max id
router.get('/events/max', (req, res) => {
    connection((db) => {
        db.collection('events')
            .find({})
            .sort({ "id": -1 })
            .limit(1)
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});


//Update event
router.put('/event/:id', (req, res) => {
    req.body.id = parseInt(req.body.id);
    connection((db) => {
        db.collection('events')
            .insert(req.body, function (err, result) {
                if (err)
                    res.send('Error');
                else
                    res.send('Success');
            });
        db.close();
    })
});

// Get events by group id
router.get('/events/:id', (req, res) => {
    var idGrupo = req.params.id;
    connection((db) => {
        db.collection('events')
            .find({ "organizador.id": Number(idGrupo) })
            .sort({ "start":-1})//order by start desc
            .toArray()
            .then((user) => {
                response.data = user;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

//Post events
router.post('/events', (req, res) => {
    req.body.start = new Date(req.body.start);
    req.body.id = parseInt(req.body.id);
    connection((db) => {
        db.collection('events')
            .insert(req.body, function (err, result) {
                if (err)
                    res.send('Error');
                else
                    res.send('Success');
            });
        db.close();
    })
});

//Delete user. Le elimina también de los eventos a los que está apuntado.
router.delete('/users/:id', (req, res) => {
    var id = req.params.id;
    id = parseInt(id);
    var objeto = { id: id };
    connection((db) => {
        db.collection('users')
            .deleteOne(objeto, function (err, result) {
                if (err)
                    res.send('Error');
                else
                    res.send('Success');
            });
        db.close();
    });
    connection((db) => {
        db.collection('events')
            .update({}, { $pull: { apuntados: id }},{multi:true} );
        db.close();
    });
});


// Get users max id
router.get('/users/max', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find({})
            .sort({ "id": -1 })
            .limit(1)
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

//POst users
router.post('/users', (req, res) => {
    req.body.id=parseInt(req.body.id);
    connection((db) => {
        db.collection('users')
            .insert(req.body, function (err, result) {
                if (err)
                    res.send('Error');
                else
                    res.send('Success');
            }); 
        db.close();
    })
});

// Get events
router.get('/events', (req, res) => {
    connection((db) => {
        db.collection('events')
            .find()
            .toArray()
            .then((events) => {
                response.data = events;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

// Get groups
router.get('/groups', (req, res) => {
    connection((db) => {
        db.collection('grupos')
            .find()
            .sort({ "nombre":1})//order by start desc
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response); 
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});


// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .sort({'name':1})
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

// Get user by Id
router.get('/:id', (req, res) => {
    var idUser = req.params.id;
    connection((db) => {
        db.collection('users')
            .findOne({ id: Number(idUser) })
            .then((user) => {
                response.data = user;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

// Get group by id
router.get('/groups/:id', (req, res) => {
    var idGrupo = req.params.id;
    connection((db) => {
        db.collection('grupos')
            .findOne({ id: Number(idGrupo) })
            .then((user) => {
                response.data = user;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
        db.close();
    });
});

module.exports = router;