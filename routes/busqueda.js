const express = require('express');

const app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ===========================================
// Busqueda por Colección
// ===========================================

// Recibe un parametro "coleccion" opcional y es obligatorio el parametro "tabla" y "busqueda"
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda solo son: medicos, usuarios, hospitales',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data // Al estar en corchetes me imprime el valor de la variable dinamicamente
        });
    });
});



// ===========================================
// Busqueda General
// ===========================================

// Recibe un parametro "todo" opcional y es obligatorio el parametro "busqueda"
app.get('/todo/:busqueda', (req, res) => {

    // Extraemos el parametro busqueda de la URL
    var busqueda = req.params.busqueda;

    // Se agrega Expresion regular en la para que no sea sensible la busqueda
    var regex = new RegExp(busqueda, 'i');

    // Arreglo de promesas, para ejecutar varias promesas a la vez
    // Implemento las funciones que devuelve una promesa cada una

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => { // Me va a devolver un [] de los resolve de las promesas

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

// ===========================================
// Funciones que Devuelven Promesas
// ===========================================

function buscarHospitales(busqueda, regex) {

    // Necesito que la función me devuelva una promesa
    return new Promise((resolve, reject) => {

        // Quiero buscar en hospitales por el nombre el parametro busqueda
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        // Parametro de la funcion or() para buscar en varios campos a la vez
        // exec() es para seguir el procedimiento
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;