const express = require('express');
const modelUser = require('../models/user');
const modelGroup = require('../models/group');
const modelSubject = require('../models/subject');
const axios = require('axios');
const fetch = require('node-fetch');
const mongoose = require("mongoose")

const createGroup = async (req, res)=>{
    try{
        const {name, subject, teacher} = req.body;
        // console.log(req.body);
        const newGroup = new modelGroup({name, subject, teacher});
        // console.log(newSubject);
        const savedGroup = await newGroup.save();

        res.status(201).json({ message: "Grupo creado", group: savedGroup });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getAllGroups = async (req, res) => {
    try{
        const groups = await modelGroup.find();
        res.status(200).json(groups);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const getAllGroupsMonitorEmpty = async (req, res) => {
    try {
        // Utilizamos la agregación para realizar un "inner join" y filtrar por monitor vacío
        const groupsWithSubjectsAndEmptyMonitor = await modelGroup.aggregate([
            // Etapa 1: Unir con la colección de asignaturas
            {
                $lookup: {
                    from: "subjects", // Nombre de la colección de grupos
                    localField: "subject", // Campo local a unir (en este caso, el ID de la asignatura)
                    foreignField: "_id", // Campo en la colección de grupos que se corresponde con el campo local (la referencia a la asignatura)
                    as: "subject" // Nombre del campo donde se almacenarán los resultados de la unión
                }
            },
            // Etapa 2: Filtrar por monitor vacío
            {
                $match: {
                    monitor: null
                }
            }
        ]).exec();

        res.status(200).json(groupsWithSubjectsAndEmptyMonitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllGroupsMonitorNotEmpty = async (req, res) => {
    try {


        // Utilizamos la agregación para realizar un "inner join" y filtrar por monitor no vacío
        const groupsWithSubjectsAndNotEmptyMonitor = await modelGroup.aggregate([
            // Etapa 1: Unir con la colección de asignaturas
            {
                $lookup: {
                    from: "subjects", // Nombre de la colección de asignaturas
                    localField: "subject", // Campo local a unir (en este caso, el ID de la asignatura)
                    foreignField: "_id", // Campo en la colección de asignaturas que se corresponde con el campo local (la referencia a la asignatura)
                    as: "subject" // Nombre del campo donde se almacenarán los resultados de la unión
                }
            },
            // Etapa 2: Unir con la colección de monitores
            {
                $lookup: {
                    from: "users", // Nombre de la colección de monitores
                    localField: "monitor", // Campo local a unir (en este caso, el ID del monitor)
                    foreignField: "_id", // Campo en la colección de monitores que se corresponde con el campo local (la referencia al monitor)
                    as: "monitor" // Nombre del campo donde se almacenarán los resultados de la unión
                }
            },
            // Etapa 3: Unir con la colección de profesores
            {
                $lookup: {
                    from: "users", // Nombre de la colección de monitores
                    localField: "teacher", // Campo local a unir (en este caso, el ID del monitor)
                    foreignField: "_id", // Campo en la colección de monitores que se corresponde con el campo local (la referencia al monitor)
                    as: "teacher" // Nombre del campo donde se almacenarán los resultados de la unión
                }
            },
            // Etapa 3: Filtrar por monitor no vacío
            {
                $match: {
                    "monitor": { $ne: [] } // Filtrar documentos donde el campo "monitor" no es nulo
                }
            }
        ]).exec();

        res.status(200).json(groupsWithSubjectsAndNotEmptyMonitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const updateGroup = async (req, res)=>{
    try{
        const {id} = req.params;
        // const monitorId = mongoose.Types.ObjectId.createFromHexString(req.body.monitor);
        const group = await modelGroup.findById(id);
        if(!group){
            res.status(404).json({message: 'Group not found'});
        } else {

            group.monitor = mongoose.Types.ObjectId.createFromHexString(req.body.monitor);
            await group.save();
            res.status(200).json(group);
        }

        // modelGroup.updateOne({ _id: group._id }, { $set: { monitor: monitorId } })
        //     .then(result => {
        //         console.log('Monitor actualizado:', result);
        //     })
        //     .catch(error => {
        //         console.error('Error al actualizar el monitor:', error);
        //     });
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};





module.exports = {createGroup, getAllGroups, updateGroup, getAllGroupsMonitorEmpty, getAllGroupsMonitorNotEmpty};