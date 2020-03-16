// Requires (importo librerias)
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar Variables
var app = express();

// Body Parser (middleWares)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var imagenesRoutes = require('./routes/imagenes');
var uploadRoutes = require('./routes/upload');
var busquedaRoutes = require('./routes/busqueda');
var medicoRoutes = require('./routes/medico');
var hospitalRoutes = require('./routes/hospital');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

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

// Server index config (muestra el file system)
/**
 *
 * var serveIndex = require('serve-index');
 * app.use(express.static(__dirname + '/'));
 * app.use('/uploads', serveIndex(__dirname + '/uploads'));
 *  
 */




// Rutas
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);

app.use('/', appRoutes); // Siempre la última

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'onLine');
});