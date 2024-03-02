const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    documentNumber: { type: Number, required: true, unique: true},
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    current_password: { type: String, require: true },
    role: { type: String, required: true, default: "user" },
    active: { type: Boolean, required: true, default: false },
})

module.exports = mongoose.model("User", userSchema);

