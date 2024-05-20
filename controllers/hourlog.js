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
        const newHourLog = new modelHourLog({program, subject, group, teacher, monitor, date, hours});
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
            }
        ]).exec();
        res.status(200).json(hoursLog);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getAllHoursLogByMonitorDate = async (req, res) => {
    try{
        const {id} = req.params;

        // Obtener la fecha actual
        const currentDate = new Date();

        // Determinar el mes actual
        const currentMonth = currentDate.getMonth();

        // Definir el primer día del semestre
        let firstDayOfSemester = new Date(currentDate.getFullYear(), 0, 1); // Por defecto, el semestre comienza en enero (mes 0)

        // Si el mes actual es mayor que 5 (junio), el semestre comienza en julio (mes 6)
        if (currentMonth > 5) {
            firstDayOfSemester = new Date(currentDate.getFullYear(), 6, 1);
        }

        // Definir el último día del semestre
        const lastDayOfSemester = new Date(firstDayOfSemester.getFullYear(), firstDayOfSemester.getMonth() + 6, 0);

        // Establecer la hora para el primer día del semestre
        firstDayOfSemester.setHours(0, 0, 0, 0);

        // Establecer la hora para el último día del semestre
        lastDayOfSemester.setHours(23, 59, 59, 999);

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
                    "monitor._id": new mongoose.Types.ObjectId(id),
                    date: { $gte: firstDayOfSemester, $lt: lastDayOfSemester },
                    active: true
                }
            },
            {
                $project: {
                    month: { $month: "$date" } // Proyectar solo el mes de la fecha
                }
            },
            {
                $group: {
                    _id: "$month" // Agrupar por mes
                }
            }
        ]).exec();

        function getMonthName(monthNumber) {
            const months = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            return months[monthNumber - 1]; // Los meses comienzan desde 0 en JavaScript, pero queremos empezar desde 1
        }


        const monthsArray = hoursLog.map(item => item._id);

        const monthNames = monthsArray.map(getMonthName);

        res.status(200).json(monthNames);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

//Obtener hourslog con los m
const getAllHoursLogByMonitorAndSemester = async (req, res) => {
    try{

        const {id} = req.params;
        const {month} = req.query;

        console.log(month)
        
        // Array de nombres de meses
        const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

        // Obtener el número de mes
        const monthNumber = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());

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
                    "monitor._id": new mongoose.Types.ObjectId(id),
                    // Filtrar por el mes especificado
                    $expr: { $eq: [{ $month: "$date" }, monthNumber + 1] }, // Se suma 1 ya que los meses en JavaScript son base 0
                    active: true
                }
            }
        ]).exec();

        const sumHours = await modelHourLog.aggregate([
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
                    "monitor._id": new mongoose.Types.ObjectId(id),
                    // Filtrar por el mes especificado
                    $expr: { $eq: [{ $month: "$date" }, monthNumber + 1] }, // Se suma 1 ya que los meses en JavaScript son base 0
                    active: true
                }
            },
            {
                $group: {
                    _id: null, // Agrupar todos los documentos en un solo grupo
                    totalHours: { $sum: "$hours" } // Sumar los valores de la campo "hours"
                }
            }
        ]).exec();


        res.status(200).json({hoursLog, sum: sumHours});
    }catch(error){
        res.status(500).json({message: error.message});
    }

};

const getAllHoursLogByMonitorId = async (req, res) => {
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
    }catch (error) {
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

module.exports = {createHourLog, getHourLogById, getAllDates, getAllHoursLogByMonitorId, getAllHoursLog, getAllHoursLogByMonitorDate, getAllHoursLogByMonitorAndSemester, hourLogDelete, getAllHoursLogByTeacherId, updateHourLog, getAllHoursLog};