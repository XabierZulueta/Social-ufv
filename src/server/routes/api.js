const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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

//Post events
router.post('/events', (req, res) => {
    req.body.start = new Date(req.body.start);
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

// Get users
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

//POst events
router.post('/xabi', (req, res) => {
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