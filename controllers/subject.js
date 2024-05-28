const express = require('express');
const modelUser = require('../models/user');
const modelGroup = require('../models/group');
const modelSubject = require('../models/subject');
const axios = require('axios');
const fetch = require('node-fetch');

/**
 * Crea una nueva asignatura y la guarda en la base de datos.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} La asignatura creada o un mensaje de error.
 */
const createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        const newSubject = new modelSubject({ name });
        const savedSubject = await newSubject.save();

        res.status(201).json({ message: "Asignatura creada", subject: savedSubject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Obtiene todas las asignaturas.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} Las asignaturas encontradas o un mensaje de error.
 */
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await modelSubject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Actualiza una asignatura por su ID.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} La asignatura actualizada o un mensaje de error.
 */
const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await modelSubject.findById(id);
        if (!subject) {
            res.status(404).json({ message: 'Asignatura no encontrada' });
        } else {
            subject.monitor = req.body.monitor;
            await subject.save();
            res.status(200).json(subject);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSubject, getAllSubjects, updateSubject };
