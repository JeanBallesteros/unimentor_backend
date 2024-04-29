const mongoose = require('mongoose')
const hourLogSchema = mongoose.Schema({
    program: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Programs",
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subjects",
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups",
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users",
        required: true
    },
    monitor: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users",
        required: true
    },
    date: { type: Date, required: true},
    hours: { type: Number, required: true}
})

module.exports = mongoose.model("HourLog", hourLogSchema);