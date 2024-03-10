const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const modelUser = require('../models/user');
const fetch = require('node-fetch');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');

require("dotenv").config()

const login = async (req, res) => {
    try {
        const { email, current_password } = req.body;

        if (!email || !current_password) {
            res.status(400).send({ message: "Email y contraseña son requeridos" });
            return/*  res
            .status(400)
            .json({ error: "Email y contraseña son requeridos" }); */
        }

        const user = await modelUser.findOne({
            email: email
        });

        console.log("Usuario: " + user);

        if (!user) {
            res.status(404).send({ message: "Usuario no encontrado" });
            return /* res.status(404).json({ error: "Usuario no encontrado" }); */
        }

        const validPassword = await bcrypt.compare(current_password, user.current_password);

        if (!validPassword) {
            res.status(400).send({ message: "Contraseña incorrecta" });
            return /* res.status(400).json({ error: "Contraseña incorrecta" }); */
        }

        const accessToken = createAccessToken({user}); 
        const refreshToken = createRefreshToken({user});

        if (!accessToken || !refreshToken) {
            return res.status(500).json({ error: "Error al generar el token" });
        }

        res.status(200).json({ message: "Bienvenido", accessToken, refreshToken });

        console.log("Bienvenido " + user.fullname);
    }catch{
        console.log("{ message: error.message }")
    }
    
};

const register = async (req, res) => {
    try {
        const {documentNumber, fullname, email, current_password } = req.body;

        // Validar que el email no esté vacío y sea un email válido
        if (!email || !email.includes('@autonoma.edu.co')) {
            return res.status(400).json({ error: "El email no es válido" });
        }

        // Validar que la contraseña no esté vacía y cumpla con ciertos criterios
        if (!current_password || current_password.length < 8) {
            return res.status(400).json({ error: "La contraseña no cumple con los requisitos mínimos" });
        }

        // Hashear la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(current_password, 10);

        // Crear un nuevo usuario con la contraseña hasheada
        const user = new modelUser({ documentNumber, fullname, email, current_password: hashedPassword});
        await user.save();

        res.status(200).json({ msg: "Usuario creado correctamente"});

    } catch (error) {
        // Manejar errores y responder con un estado HTTP 500 (Internal Server Error) en caso de un error interno
        console.error(error);
        res.status(500).json({ error: "Error en el registro de usuario" });
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(400).json({ error: "El refreshToken es requerido" });
    }
  
    try {
      // Verificar la validez del refreshToken y obtener el usuario asociado
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
      const user = await modelUser.findById(decoded.user._id);
  
      console.log(user)

      // Generar un nuevo accessToken
      const accessToken = createAccessToken({user});

      console.log(accessToken)
  
      // Enviar el nuevo accessToken al cliente
      res.status(200).send({ accessToken });
    } catch (error) {
      // Si hay un error al verificar el refreshToken
      res.status(401).json({ error: "El refreshToken es inválido o ha expirado" });
    }
};

function createAccessToken(modelUser) {
    const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
}

function createRefreshToken(modelUser) {
    const refreshToken = jwt.sign(modelUser, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '1d' });
    return refreshToken;
}

module.exports = { login, register, createAccessToken, createRefreshToken, refreshToken };
