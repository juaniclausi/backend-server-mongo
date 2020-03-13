var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ===========================================
// Verificar Token (middleWare)
// ===========================================

exports.verificaToken = function(req, res, next) {

    // Recibo el token por el URL
    var token = req.query.token;

    // Verifico que el token sea valido
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        // Paso la información del usuario (que hace la peticion)
        req.usuario = decoded.usuario;

        // Continua con el servicio una vez que haya verificado el token
        next();

        // res.status(200).json({
        //     ok: true,
        //     decoded
        // });

    });
};