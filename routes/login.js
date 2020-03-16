var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ===========================================
// Autenticacion Google
// ===========================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido'
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioBD) {

            // Compruebo si se autentico por google
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su atutenticación normal'
                });

            } else {

                // Creo un nuevo token
                var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); // 14400 = 4 hs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioBD,
                    token: token,
                    id: usuarioBD.id
                });
            }

        } else {

            // El usuario no existe... hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al crear usuario',
                        errors: err
                    });
                }

                // Creo un nuevo token
                var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); // 14400 = 4 hs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioBD,
                    token: token,
                    id: usuarioBD.id
                });



            });


        }
    });



});

// ===========================================
// Autenticacion normal
// ===========================================

app.post('/', (req, res) => {

    // Extraemos el body
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        // Funcion para comparar strings

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token !!!
        usuarioBD.password = ':)';

        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); // 14400 = 4 hs

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD.id
        });

    });

});

module.exports = app;