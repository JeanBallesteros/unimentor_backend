const express = require('express');
const modelUser = require('../models/user');
const modelProgram = require('../models/program');
const modelHourLog = require('../models/hourlog');
const axios = require('axios');
const fetch = require('node-fetch')
const mongoose = require("mongoose")

const createHourLog = async (req, res)=>{
    try{
        const {program, subject, group, teacher, monitor, date, hours} = req.body;
        // console.log(req.body);
        const newHourLog = new modelHourLog({program, subject, group, teacher, monitor, date, hours});
        // console.log(newProgram);
        const savedHourLog = await newHourLog.save();

        res.status(201).json({ message: "Programa creado", hourlog: savedHourLog });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getHourLogById = async (req, res) => {
    try{
        const {id} = req.params;
        const hourLog = await modelHourLog.findById(id)
        res.status(200).json(hourLog);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const getAllHoursLog = async (req, res) => {
    try{

        const {id} = req.params;
        const hoursLog = await modelHourLog.aggregate([
            {
                $lookup: {
                    from: "programs", 
                    localField: "program", 
                    foreignField: "_id", 
                    as: "program" 
                }
            },
            {
                $lookup: {
                    from: "subjects", 
                    localField: "subject", 
                    foreignField: "_id", 
                    as: "subject" 
                }
            },
            {
                $lookup: {
                    from: "groups", 
                    localField: "group", 
                    foreignField: "_id", 
                    as: "group" 
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "teacher", 
                    foreignField: "_id", 
                    as: "teacher" 
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "monitor", 
                    foreignField: "_id", 
                    as: "monitor" 
                }
            },
            {
                $match: {
                    "monitor._id": new mongoose.Types.ObjectId(id)
                }
            }
        ]).exec();
        res.status(200).json(hoursLog);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const getAllDates = async (req, res) => {
    try {
        const {id} = req.params
        // Obtener todos los documentos HourLog
        const hourLogs = await modelHourLog.find({ group: id });
    
        // Inicializar un array para almacenar las fechas
        const dates = [];
    
        // Iterar sobre cada documento HourLog
        hourLogs.forEach(hourLog => {
            // Extraer la fecha de cada documento y agregarla al array
            dates.push(hourLog.date);
        });
    
        // Devolver las fechas encontradas como respuesta
        res.status(200).json({ dates });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const hourLogDelete = async (req, res) => {
    try {
        const hourLogId = req.params.id;
        const hourLog = await modelHourLog.findById(hourLogId);
        await hourLog.deleteOne();
        res.status(200).json({ message: "Registro eliminado correctamente" });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllHoursLogByTeacherId = async (req, res) => {
    try{

        const {id} = req.params;

        // Obtener el primer día del mes actual
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        // Obtener el último día del mes actual
        const lastDayOfMonth = new Date(firstDayOfMonth);
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
        lastDayOfMonth.setDate(0);
        lastDayOfMonth.setHours(23, 59, 59, 999);

        console.log(firstDayOfMonth)
        console.log(lastDayOfMonth)


        const hoursLog = await modelHourLog.aggregate([
            {
                $lookup: {
                    from: "programs", 
                    localField: "program", 
                    foreignField: "_id", 
                    as: "program" 
                }
            },
            {
                $lookup: {
                    from: "subjects", 
                    localField: "subject", 
                    foreignField: "_id", 
                    as: "subject" 
                }
            },
            {
                $lookup: {
                    from: "groups", 
                    localField: "group", 
                    foreignField: "_id", 
                    as: "group" 
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "teacher", 
                    foreignField: "_id", 
                    as: "teacher" 
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "monitor", 
                    foreignField: "_id", 
                    as: "monitor" 
                }
            },
            {
                $match: {
                    "teacher._id": new mongoose.Types.ObjectId(id),
                    date: { $gte: firstDayOfMonth, $lt: lastDayOfMonth }
                }
            }
        ]).exec();
        res.status(200).json(hoursLog);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const updateHourLog = async (req, res)=>{
    try{
        const {id} = req.params;
        const hourLog = await modelHourLog.findById(id);
        if(!hourLog){
            res.status(404).json({message: 'HourLog not found'});
        } else {
            hourLog.active = req.body.active;
            await hourLog.save();
            res.status(200).json(hourLog);
        }
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {createHourLog, getHourLogById, getAllDates, getAllHoursLog, hourLogDelete, getAllHoursLogByTeacherId, updateHourLog};