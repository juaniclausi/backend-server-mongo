var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

var hospitalSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

hospitalSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Hospital', hospitalSchema);


/**
 *
 * Schema.Types.ObjectId, esto es utilizado para indicarle a Mongoose,
 * que ese campo es una relación con otra colección, y la referencia
 * es Usuario. Al final este campo nos dirá qué usuario creó
 * el registro. Se guarda únicamente el usuario._id en ese campo
 *
 * { collection: ‘hospitales’ } esto simplemente es para
 * evitar que Mongoose coloque el nombre a la
 * colección como hospitals.
 *
 */