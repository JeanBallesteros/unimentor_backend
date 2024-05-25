const express = require('express');
const modelUser = require('../models/user');
const modelProgram = require('../models/program');
const axios = require('axios');
const fetch = require('node-fetch');

/**
 * Crea un nuevo programa y lo guarda en la base de datos.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} El programa creado o un mensaje de error.
 */
const createProgram = async (req, res) => {
    try {
        const { name, subjects } = req.body;
        const newProgram = new modelProgram({ name, subjects });
        const savedProgram = await newProgram.save();

        res.status(201).json({ message: "Programa creado", program: savedProgram });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Encuentra un programa por el ID de una asignatura.
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @returns {object} El programa encontrado o un mensaje de error.
 */
const findProgramBySubjectId = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Buscar el programa que contiene la asignatura con el _id especificado en su array de asignaturas
        const program = await modelProgram.findOne({
            subjects: { $elemMatch: { $eq: subjectId } }
        });

        // Verificar si se encontró el programa
        if (!program) {
            return res.status(404).json({ message: "Programa no encontrado" });
        }

        // Si se encontró el programa, devolverlo como respuesta
        res.status(200).json({ program });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProgram, findProgramBySubjectId };
