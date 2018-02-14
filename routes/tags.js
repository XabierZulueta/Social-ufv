const Grupo = require('../models/Models.js').Grupo;

module.exports = (router) => {

    router.get('/tags', (req, res) => {
        Grupo.distinct('tags', (err, tags) => {
            if (err) {
                console.log(err);
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, message: 'tags', tags: tags });
            }
        })
    });

    return router;
};

