const express = require('express');
const modelUser = require('../models/user');
const modelProgram = require('../models/program');
const modelReport = require('../models/report');
const axios = require('axios');
const fetch = require('node-fetch')

const createReport = async (req, res)=>{
    try{
        const {hoursLog, pricePerHour, date} = req.body;
        const newReport = new modelReport({hoursLog, pricePerHour, date});
        const savedReport = await newReport.save();

        res.status(201).json({ message: "Reporte creado", report: savedReport });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getAllReports = async (req, res) => {
    try {

        // const {month} = req.params

        const report = await modelReport.find().sort({ date: -1 }).limit(1);
        if (!report || report.length === 0) {
            return res.status(404).json({ message: "Reporte más reciente no encontrado" });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {createReport, getAllReports};