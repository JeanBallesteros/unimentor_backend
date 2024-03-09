const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const modelUser = require('../models/user');
const fetch = require('node-fetch');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');

require("dotenv").config()

const login = async (req, res) => {
    const { email, current_password } = req.body;

    if (!email || !current_password) {
        return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }

    const user = await modelUser.findOne({
        email: email
    });

    console.log("Usuario: " + user);

    if (!user) {
        return res
        .status(404)
        .json({ error: "Usuario no encontrado" });
        console.log("Usuario no encontrado");
    }

    const validPassword = await bcrypt.compare(current_password, user.current_password);

    if (!validPassword) {
        return res
        .status(400)
        .json({ error: "Contraseña incorrecta" });
        console.log("Contraseña incorrecta");
    }

    const accessToken = createAccessToken({ id: user.id }); 
    const refreshToken = createRefreshToken({ id: user.id });

    if (!accessToken || !refreshToken) {
        return res.status(500).json({ error: "Error al generar el token" });
    }

    res.status(200)
    .json({ message: "Bienvenido", accessToken, refreshToken });
    console.log("Bienvenido " + user.fullname);
    
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

        // Genera un token único para el usuario
        const token = crypto.randomBytes(64).toString('hex');

        // Crear un nuevo usuario con la contraseña hasheada
        const user = new modelUser({ documentNumber, fullname, email, current_password: hashedPassword, token });
        await user.save();

        res.status(200).json({ msg: "Usuario creado correctamente"});

    } catch (error) {
        // Manejar errores y responder con un estado HTTP 500 (Internal Server Error) en caso de un error interno
        console.error(error);
        res.status(500).json({ error: "Error en el registro de usuario" });
    }
}

function createAccessToken(modelUser) {
    const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
}

function createRefreshToken(modelUser) {
    const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
}

module.exports = { login, register, createAccessToken, createRefreshToken };
