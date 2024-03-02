const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")

const dotenv = require('dotenv').config()

const path = require('path');

const cors = require("cors")

app.use(cors());

//Visualizacion del contenido del endpoint o envio del contenido
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//USERS
app.use(`/${process.env.API_PATH}/users`,userRoutes);

app.use(`/${process.env.API_PATH}/auth`,authRoutes);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Method")
})

module.exports = app
