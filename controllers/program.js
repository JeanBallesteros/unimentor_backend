const express = require('express');
const modelUser = require('../models/user');
const modelProgram = require('../models/program');
const axios = require('axios');
const fetch = require('node-fetch')

const createProgram = async (req, res)=>{
    try{
        const {name, subjects} = req.body;
        // console.log(req.body);
        const newProgram = new modelProgram({name, subjects});
        // console.log(newProgram);
        const savedProgram = await newProgram.save();

        res.status(201).json({ message: "Programa creado", program: savedProgram });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const findProgramBySubjectId = async (req, res) => {
    try {
        // console.log(subjectId);
        const { subjectId } = req.params;

        // console.log(subjectId)
    
        // Buscar el programa que contiene la asignatura con el _id especificado en su array de asignaturas
        const program = await modelProgram.findOne({
            subjects: { $elemMatch: { $eq: subjectId } }
        });
    
        // Verificar si se encontró el programa
        if (!program) {
            return res.status(404).json({ message: "Programa no encontrado" });
        }
    
        // Si se encontró el programa, devolverlo como respuesta
        res.status(200).json({program});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };

module.exports = {createProgram, findProgramBySubjectId};