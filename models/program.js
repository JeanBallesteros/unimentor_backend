const mongoose = require('mongoose')
const programSchema = mongoose.Schema({
    name: { type: String, required: true},
    subjects: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subjects"
    }],
})

module.exports = mongoose.model("Program", programSchema);