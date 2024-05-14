const mongoose = require('mongoose')
const reportSchema = mongoose.Schema({
    hoursLog: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "HourLog"
    }],
    pricePerHour: { type: Number, required: true},
    date: { type: Date, required: true}
})

module.exports = mongoose.model("Report", reportSchema);