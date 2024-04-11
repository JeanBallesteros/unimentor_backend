const express = require('express');
const modelUser = require('../models/user');
const modelSubject = require('../models/subject');
const axios = require('axios');
const fetch = require('node-fetch')

const createSubject = async (req, res)=>{
    try{
        const {name, teacher} = req.body;
        // console.log(req.body);
        const newSubject = new modelSubject({name, teacher});
        // console.log(newSubject);
        const savedSubject = await newSubject.save();

        res.status(201).json({ message: "Asignatura creada", subject: savedSubject });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// const getAllSubjects = async (req, res)=>{
//     try{
//         const subjects = await modelSubject.find();
//         res.status(200).json(subjects);
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// };

const getAllSubjects = async (req, res)=>{
    try{
        const subjects = await modelSubject.find();
        res.status(200).json(subjects);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// const getAllSubjects = async (req, res)=>{
//     try{
//         const subjects = await modelSubject.find();
//         res.status(200).json(subjects);
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// };

module.exports = {createSubject, getAllSubjects};