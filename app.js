const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")

const dotenv = require('dotenv').config()

const path = require('path');

const cors = require("cors")

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus:200
}));

// Visualización del contenido del endpoint o envío del contenido
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// USERS
app.use(`/${process.env.API_PATH}/users`, userRoutes);

app.use(`/${process.env.API_PATH}/auth`, authRoutes);

// Configuración de cabeceras CORS para permitir métodos HTTP
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE"
      )
      return res.status(200).json({})
    }
    next()
})

module.exports = app
