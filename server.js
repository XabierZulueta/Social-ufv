const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const config = require('./config/config.dev');
const authentication = require('./routes/authentication')(router);
const notifications = require('./routes/notificaciones')(router);
const eventos = require('./routes/events')(router);
const grupos = require('./routes/grupos')(router);
const cors = require('cors');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(config.uri)
    .then(() => console.log('connection successful ' + config.db))
    .catch((err) => console.error(err));

// EVENTOS
// var evento = require('./routes/eventos');

const app = express();

//Cross origin
app.use(cors());

// API file for interacting with MongoDB
const api = require('./src/server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/evento', evento);

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/authentication', authentication);
app.use('/notificaciones', notifications);
app.use('/grupos', grupos);
app.use('/eventos', eventos);

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.json({ success: false, message: 'Ruta desconocida' });
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

app.listen(8080, () => console.log('Running on 127.0.0.1:8080'));

module.exports = app;