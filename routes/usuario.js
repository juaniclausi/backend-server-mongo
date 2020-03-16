var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ===========================================
// Obtener todos los usuarios
// ===========================================

app.get('/', (req, res, next) => {

    // Creo variable para esperar en la respuesta un parametro desde donde quiero paginar (limit) 
    var desde = req.query.desde || 0;
    // Me aseguro que este parametro sea un numero ( validar en el front que sea un numero )
    desde = Number(desde);

    // Restrinjo los valores devueltos= 'nombre email img role'
    Usuario.find({}, 'nombre email img role')
        .skip(desde) // Empiezo desde el registro numero (desde)
        .limit(5) // Pagino casa 5 registro
        .exec(
            (err, usuarios) => {
                if (err) {
                    // El "return" es para que hasta ahí siga la ejecución si hay un error
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                // countDocuments --> función de mongoose, para hacer la cuenta de cuantos usuarios tengo
                Usuario.countDocuments({}, (err, conteo) => {

                    if (err) {

                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando usuarios',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        totalUsuario: conteo,
                        usuarios: usuarios
                    });
                });

            });
});

// ===========================================
// Actualizar usuario
// ===========================================

app.put('/:id', mAutenticacion.verificaToken, (req, res) => {

    // Obtener id pasado por URL
    var id = req.params.id;
    // Extraemos el body
    var body = req.body;

    // Verifico que exista el usuario
    Usuario.findById(id, (err, usuario) => {

        // Evaluamos si hay un error en la búsqueda
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // Evaluamos si no viene un usuario
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            // Estoy modificando el resultado que muestra en el backend
            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });


});

// ===========================================
// Crear un nuevo Usuario
// ===========================================

app.post('/', mAutenticacion.verificaToken, (req, res) => {

    // Extraemos el body
    var body = req.body;

    // Creamos un objeto del tipo usuario
    // e inicializamos cada uno de los valores
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });


    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado, // Usuario que estoy creando
            usuarioToken: req.usuario // Usuario que hace la peticion
        });
    });

});

// ===========================================
// Eliminar un usuario por id
// ===========================================

app.delete('/:id', mAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con el id ' + id,
                errors: { message: 'No existe un usuario con el id ' + id }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});


module.exports = app;