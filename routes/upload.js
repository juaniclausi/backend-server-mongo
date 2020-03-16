const express = require('express');

const fileUpload = require('express-fileupload');
var fs = require('fs');

const app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospitales = require('../models/hospital');

// default options
app.use(fileUpload());

// Quiero recibir el tipo de archivo y el id del usuario
app.put('/:tipo/:id', (req, res, next) => {

    // Capturo los datos que vienen por la URL
    var tipo = req.params.tipo;
    var id = req.params.id;

    // Valido tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    // Valido que haya archivos    
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    // Obtener extension del archivo, primero corto todo despues de un punto
    var nombreCortado = archivo.name.split('.');
    // Ahora obtengo la ultima posicion del arreglo
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // Valido que este alguno de esos archivos (si no es 1, indexof devuelve un 1 si encuentra)
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });

    }

    // Nombre de archivo personalizado
    // 23134566546545-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover al archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: err
                });
            }

            if (err) {
                // El "return" es para que hasta ahí siga la ejecución si hay un error
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            // Obtengo la imagen ya cargada del usuario (si la hay)
            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                // Estoy modificando el resultado que muestra en el backend
                usuarioActualizado.password = ':)';

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al salvar imagen del usuario',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });


        });

    };

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: err
                });
            }

            if (err) {
                // El "return" es para que hasta ahí siga la ejecución si hay un error
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            // Obtengo la imagen ya cargada del medico (si la hay)
            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al salvar imagen del medico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            });


        });

    };

    if (tipo === 'hospitales') {

        Hospitales.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: err
                });
            }

            if (err) {
                // El "return" es para que hasta ahí siga la ejecución si hay un error
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            // Obtengo la imagen ya cargada del hospital (si la hay)
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al salvar imagen del hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            });


        });


    };



}

module.exports = app;