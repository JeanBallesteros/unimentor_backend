/**
 * Módulo de autenticación y registro de usuarios.
 * @module authController
 */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const modelUser = require("../models/user");
const fetch = require("node-fetch");
const crypto = require("crypto");

require("dotenv").config();

/**
 * Función para manejar el inicio de sesión de usuarios.
 * @function login
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP con el token de acceso y de actualización si el inicio de sesión es exitoso.
 */
const login = async (req, res) => {
  try {
    const { email, current_password } = req.body;

    // Verificar si se proporcionaron un email y una contraseña
    if (!email || !current_password) {
      res.status(400).send({ message: "Email y contraseña son requeridos" });
      return;
    }

    // Buscar el usuario en la base de datos
    const user = await modelUser.findOne({
      email: email,
    });

    // Verificar si el usuario existe
    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }

    // Verificar si la contraseña proporcionada coincide con la almacenada en la base de datos
    const validPassword = await bcrypt.compare(
      current_password,
      user.current_password
    );

    // Si la contraseña no coincide, responder con un error
    if (!validPassword) {
      res.status(400).send({ message: "Contraseña incorrecta" });
      return;
    }

    // Crear tokens de acceso y actualización
    const accessToken = createAccessToken({ user });
    const refreshToken = createRefreshToken({ user });

    // Si no se pudieron generar los tokens, responder con un error
    if (!accessToken || !refreshToken) {
      return res.status(500).json({ error: "Error al generar el token" });
    }

    // Responder con éxito y los tokens
    res.status(200).json({ message: "Bienvenido, " + user.fullname, accessToken, refreshToken });
  } catch (error) {
    // Capturar errores internos del servidor
    res.status(500).json({ message: error.message });
  }
};

/**
 * Función para registrar nuevos usuarios.
 * @function register
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP indicando el éxito o el fracaso del registro.
 */
const register = async (req, res) => {
  try {
    const { documentNumber, fullname, email, current_password } = req.body;

    // Validar el formato del email
    if (!email || !email.includes("@autonoma.edu.co")) {
      return res.status(400).json({ error: "El email no es válido" });
    }

    // Validar la longitud de la contraseña
    if (!current_password || current_password.length < 8) {
      return res.status(400).json({ error: "La contraseña no cumple con los requisitos mínimos" });
    }

    // Hash de la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(current_password, 10);

    // Crear un nuevo usuario con los datos proporcionados
    const user = new modelUser({
      documentNumber,
      fullname,
      email,
      current_password: hashedPassword,
    });
    
    // Guardar el nuevo usuario en la base de datos
    await user.save();

    // Responder con éxito
    res.status(200).json({ msg: "Usuario creado correctamente" });
  } catch (error) {
    // Capturar errores internos del servidor
    res.status(500).json({ error: "Error en el registro de usuario" });
  }
};

/**
 * Función para generar un nuevo token de acceso utilizando un token de actualización.
 * @function refreshToken
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP con el nuevo token de acceso.
 */
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  // Verificar si se proporcionó un token de actualización
  if (!refreshToken) {
    return res.status(400).json({ error: "El refreshToken es requerido" });
  }

  try {
    // Verificar y decodificar el token de actualización
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    // Buscar el usuario correspondiente al token de actualización
    const user = await modelUser.findById(decoded.user._id);

    // Generar un nuevo token de acceso utilizando los datos del usuario
    const accessToken = createAccessToken({ user });

    // Responder con el nuevo token de acceso
    res.status(200).send({ accessToken });
  } catch (error) {
    // Capturar errores de token inválido o expirado
    res.status(401).json({ error: "El refreshToken es inválido o ha expirado" });
  }
};

/**
 * Función para crear un token de acceso JWT.
 * @function createAccessToken
 * @param {object} modelUser - Objeto de usuario para generar el token.
 * @returns {string} Token de acceso JWT.
 */
function createAccessToken(modelUser) {
  const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return accessToken;
}

/**
 * Función para crear un token de actualización JWT.
 * @function createRefreshToken
 * @param {object} modelUser - Objeto de usuario para generar el token.
 * @returns {string} Token de actualización JWT.
 */
function createRefreshToken(modelUser) {
  const refreshToken = jwt.sign(modelUser, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "1d",
  });
  return refreshToken;
}

module.exports = {login, register, createAccessToken, createRefreshToken, refreshToken};
