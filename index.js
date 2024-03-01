const mongoose = require("mongoose")
const app = require('./app')
const dotenv = require('dotenv').config()

const connection_string = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.DB_HOST}`

mongoose
    .connect(connection_string, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then(() =>{
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => console.log(`Active port ${process.env.PORT}`));
    })
    .catch((err)=>console.error(err))
