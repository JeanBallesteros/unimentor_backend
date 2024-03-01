const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require('dotenv').config()

const path = require('path');

const cors = require("cors")

app.use(cors());

//Visualizacion del contenido del endpoint o envio del contenido
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


module.exports = app
