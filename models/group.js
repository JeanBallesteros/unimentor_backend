const mongoose = require('mongoose')
const groupSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true},
    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subjects",
        required: true
    },
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

module.exports = mongoose.model("Group", groupSchema);