const mongoose = require('mongoose')
const avalSchema = mongoose.Schema({
    idUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users"
    },
    promedio: { type: String, required: true, unique: true },
    rut: { type: String, required: true, unique: true },
    certificado: { type: String, require: true, unique: true },
})

module.exports = mongoose.model("Aval", avalSchema);