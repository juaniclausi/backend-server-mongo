// Requires (importo librerias)
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variables
var app = express();

// Conexión a la BBDD
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'onLine');

});

// Rutas
app.get('/', (req, res, next) => {

    // Realizo peticion y la formateo para que venga en JSON y mando un objeto
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'onLine');
});