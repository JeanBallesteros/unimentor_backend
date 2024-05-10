const mongoose = require('mongoose')
const avalSchema = mongoose.Schema({
    idUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users",
        required: true
    },
    promedio: { type: String, required: true},
    rut: { type: String, required: true},
    certificado: { type: String, required: true},
})

module.exports = mongoose.model("Aval", avalSchema);