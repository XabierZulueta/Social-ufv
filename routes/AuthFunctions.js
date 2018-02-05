const User = require('../models/User.js');
const Grupo = require('../models/Models.js').Grupo;

module.export = {
    // If error, return the json to send to the response.
    // {success:T/F, message: string }functions.checkIfUserCanModifyGrupos
    checkIfUserCanModifyGrupos: function (req, res, callback) {
        if (!req.body.username) {
            return callback(null, { success: false, message: 'No se ha especificado usuario.' });
        } else {
            User.findOne({ username: req.body.username }, 'username role', (err, user) => {
                if (err) {
                    return callback(null, { success: false, message: err });
                } else if (!user) {
                    return callback(null, { success: false, message: 'Usuario no encontrado en la base de datos.' });
                } else if (user.role === 'admin') {
                    return callback(null, { success: true });
                } else if (user.role === 'alumno') {
                    return callback(null, { success: false, message: 'Permisos denegados para el rol de alumno' });
                } else {
                    //Representante o parte del equipo?
                    return Grupo.findOne({
                        _id: req.body.idGrupo,
                        $or: [
                            { administrador: user.username },
                            { equipo: user.username }
                        ]
                    }, (err, grupo) => {
                        // On callback, solve the promise.
                        const result = !!user;
                        callback(err, { success: grupo });
                    });
                }
            });
        }
    }
};
