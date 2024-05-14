const mongoose = require('mongoose')
const groupSchema = mongoose.Schema({
    name: { type: String, required: true},
    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subjects",
        required: true
    },
    monitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users",
        required: true
    },
})

// groupSchema.index({}, { unique: true });

module.exports = mongoose.model("Group", groupSchema);