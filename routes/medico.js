var express = require('express');
var bcrypt = require('bcryptjs');


var mAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ===========================================
// Obtener todos los médicos
// ===========================================

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.countDocuments({}, (err, cuenta) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando medicos',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        totalMedicos: cuenta,
                        ok: true,
                        medicos: medicos
                    });
                });

            });
});

// ===========================================
// Actualizar Medico
// ===========================================

app.put('/:id', mAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            medicoGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });


    });
});

// ===========================================
// Crear Médico
// ===========================================

app.post('/', mAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado, // medico que estoy creando
            usuarioToken: req.usuario // Usuario que hace la peticion
        });
    });

});

// ===========================================
// Eliminar un medico por id
// ===========================================

app.delete('/:id', mAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con el id ' + id,
                errors: { message: 'No existe un medico con el id ' + id }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});

module.exports = app;