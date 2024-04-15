const mongoose = require('mongoose')
const subjectSchema = mongoose.Schema({
    name: { type: String, required: true},
    monitor: {
        type: String, 
        ref: "Users",
        default: ""
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users",
        required: true
    },
})

module.exports = mongoose.model("Subject", subjectSchema);