const express = require('express');

const app = express();

app.get('/', (req, res, next) => {

    // Realizo peticion y la formateo para que venga en JSON y mando un objeto
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

});

module.exports = app;