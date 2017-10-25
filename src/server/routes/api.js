const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const multer = require('multer');


router.use(express.static(__dirname+ '/src/assets/uploads'));
/*
    SECCION SUBIDA DE FICHEROS
*/
var storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
        cb(null, './src/assets/uploads/')
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
    //return MongoClient.connect('mongodb://xabier:xabier@ds159274.mlab.com:59274/social-ufv',(err,db) => {
    return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
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
    })
});

// Get events by group id
router.get('/events/:id', (req, res) => {
    var idGrupo = req.params.id;
    connection((db) => {
        db.collection('events')
            .find({ "organizador.id": Number(idGrupo) })
            .toArray()
            .then((user) => {
                response.data = user;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
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
    })
});

//Delete user
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
    })
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
    });
});

// Get groups
router.get('/groups', (req, res) => {
    connection((db) => {
        db.collection('grupos')
            .find()
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


// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
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
    });
});

module.exports = router;