const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const config = require('./config/config.local');

const cors = require('cors');
const multer = require('multer');
const port = process.env.PORT || 8080;
// API file for interacting with MongoDB
const api = require('./src/server/routes/api');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(config.uri)
    .then(() => console.log('connection successful ' + config.db))
    .catch((err) => console.error(err));

const app = express();

//Cross origin
app.use(cors());


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/evento', evento);

// Angular DIST output folder
app.use(express.static(__dirname + '/dist'));

app.use(require('./routes/authentication')(router));
app.use(require('./routes/tags')(router));
app.use(require('./routes/notificaciones')(router));
app.use(require('./routes/grupos')(router));
app.use(require('./routes/eventos')(router));
app.use(require('./routes/users')(router));

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.send(path.join(__dirname + '/dist/index.html'));
});

// const server = http.createServer(app);
app.listen(port, () => console.log('Running on ' + config.name + ': ' + port));

module.exports = app;