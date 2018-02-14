const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const config = require('./config/config.local');
const authentication = require('./routes/authentication')(router);
const tags = require('./routes/tags')(router);
const notifications = require('./routes/notificaciones')(router);
const eventos = require('./routes/eventos')(router);
const grupos = require('./routes/grupos')(router);
const cors = require('cors');
const port = process.env.PORT || 8080;
// API file for interacting with MongoDB
const api = require('./src/server/routes/api');
const fileUpload = require('express-fileupload');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(config.uri)
    .then(() => console.log('connection successful ' + config.db))
    .catch((err) => console.error(err));


// EVENTOS
// var evento = require('./routes/eventos2');

const app = express();

//Cross origin
app.use(cors());


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/evento', evento);

// default options
app.use(fileUpload());

app.post('/upload', function (req, res) {
    if (!req.files) {
        console.log("no files");
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.photo;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./uploads/', function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        console.log('file uploaded');
        res.send('File uploaded!');
    });
});

// Angular DIST output folder
app.use(express.static(__dirname + '/dist'));

app.use('/authentication', authentication);
app.use(tags);
app.use(notifications);
app.use(grupos);
app.use(eventos);

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.send(path.join(__dirname + '/dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

//Set Port
// const port = process.env.PORT || '3000';
// app.set('port', port);

// const server = http.createServer(app);
app.listen(port, () => console.log('Running on 127.0.0.1:' + port));

module.exports = app;