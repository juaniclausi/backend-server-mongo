const express = require('express');

const app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    // path viene con node el .resolve ayuda a resolver el path para que siempre sea correcto
    // __dirname siempre va a ser la direccion correcta para encontrar la imagen
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    // Verificar si el path es valido
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;