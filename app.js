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
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

module.exports = app
