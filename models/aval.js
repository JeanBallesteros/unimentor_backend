const mongoose = require('mongoose')
const avalSchema = mongoose.Schema({
    idUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users" 
    },
    promedio: { type: String, required: true },
    rut: { type: String, required: true },
    certificado: { type: String, require: true },
})

module.exports = mongoose.model("Aval", avalSchema);