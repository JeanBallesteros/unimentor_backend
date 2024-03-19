const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const modelUser = require("../models/user");
const fetch = require("node-fetch");
const crypto = require("crypto");

require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, current_password } = req.body;

    console.log("Email: " + email);

    if (!email || !current_password) {
      res.status(400).send({ message: "Email y contraseña son requeridos" });
      return;
    }

    const user = await modelUser.findOne({
      email: email,
    });

    console.log("Usuario: " + user);

    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }

    const validPassword = await bcrypt.compare(
      current_password,
      user.current_password
    );

    if (!validPassword) {
      res.status(400).send({ message: "Contraseña incorrecta" });
      return;
    }

    const accessToken = createAccessToken({ user });
    const refreshToken = createRefreshToken({ user });

    if (!accessToken || !refreshToken) {
      return res.status(500).json({ error: "Error al generar el token" });
    }

    res.status(200).json({ message: "Bienvenido", accessToken, refreshToken });

    console.log("Bienvenido " + user.fullname);
  } catch {
    console.log("{ message: error.message }");
  }
};

const register = async (req, res) => {
  try {
    const { documentNumber, fullname, email, current_password } = req.body;

    if (!email || !email.includes("@autonoma.edu.co")) {
      return res.status(400).json({ error: "El email no es válido" });
    }

    if (!current_password || current_password.length < 8) {
      return res
        .status(400)
        .json({ error: "La contraseña no cumple con los requisitos mínimos" });
    }

    const hashedPassword = await bcrypt.hash(current_password, 10);

    const user = new modelUser({
      documentNumber,
      fullname,
      email,
      current_password: hashedPassword,
    });
    await user.save();

    res.status(200).json({ msg: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el registro de usuario" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "El refreshToken es requerido" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    const user = await modelUser.findById(decoded.user._id);

    console.log(user);

    const accessToken = createAccessToken({ user });

    console.log(accessToken);

    res.status(200).send({ accessToken });
  } catch (error) {
    res
      .status(401)
      .json({ error: "El refreshToken es inválido o ha expirado" });
  }
};

function createAccessToken(modelUser) {
  const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return accessToken;
}

function createRefreshToken(modelUser) {
  const refreshToken = jwt.sign(modelUser, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "1d",
  });
  return refreshToken;
}

module.exports = {
  login,
  register,
  createAccessToken,
  createRefreshToken,
  refreshToken,
};
