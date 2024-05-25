const express = require('express');
const modelUser = require('../models/user');
const fetch = require('node-fetch');
const multer = require('multer');

/**
 * Obtiene todos los usuarios.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} Los usuarios encontrados o un mensaje de error.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await modelUser.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtiene todos los monitores.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} Los monitores encontrados o un mensaje de error.
 */
const getAllMonitors = async (req, res) => {
    try {
        const users = await modelUser.find({ role: "monitor" });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Actualiza un usuario por su ID.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} El usuario actualizado o un mensaje de error.
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await modelUser.findById(id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            user.role = req.body.role;
            await user.save();
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, updateUser, getAllMonitors };
