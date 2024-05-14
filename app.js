const express = require("express")
const app = express()
const nodemailer = require("nodemailer")
const bodyParser = require("body-parser")

const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const avalRoutes = require("./routes/aval")
const asignaturaRoutes = require("./routes/subject")
const programaRoutes = require("./routes/program")
const grupoRoutes = require("./routes/group")
const hourLogRoutes = require("./routes/hourlog")
const reportRoutes = require("./routes/report")

const dotenv = require('dotenv').config()

const path = require('path');

const cors = require("cors")

app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus:200
}));


// Visualización del contenido del endpoint o envío del contenido
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// USERS
app.use(`/${process.env.API_PATH}/users`, userRoutes);

app.use(`/${process.env.API_PATH}/auth`, authRoutes);

app.use(`/${process.env.API_PATH}/avales`, avalRoutes);

app.use(`/${process.env.API_PATH}/asignaturas`, asignaturaRoutes);

app.use(`/${process.env.API_PATH}/programas`, programaRoutes);

app.use(`/${process.env.API_PATH}/grupos`, grupoRoutes);

app.use(`/${process.env.API_PATH}/hourlog`, hourLogRoutes);

app.use(`/${process.env.API_PATH}/reports`, reportRoutes);


app.use(`/${process.env.API_PATH}/uploads`, express.static('uploads'));


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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
  }
});

app.post('/send-email-denied', (req, res) => {
  const { to, subject, text } = req.body;
  
  const mailOptions = {
      from: {
          name: 'UniMentor',
          address: process.env.USER_EMAIL
      },
      to: to,
      subject: subject,
      text: text
};

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          res.status(500).send({
              message: 'Error al enviar el correo' + error.message
          });
      } else {
          res.status(200).send({
              message: 'Correo enviado correctamente'
          });
      }
  });
});

app.post('/send-email-approved', (req, res) => {
  const { to, subject, text } = req.body;
  
  const mailOptions = {
      from: {
          name: 'UniMentor',
          address: process.env.USER_EMAIL
      },
      to: to,
      subject: subject,
      text: text
};

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          res.status(500).send({
              message: 'Error al enviar el correo' + error.message
          });
      } else {
          res.status(200).send({
              message: 'Correo enviado correctamente'
          });
      }
  });
});
  

module.exports = app
