const express = require('express');
const modelUser = require('../models/user');
const modelGroup = require('../models/group');
const modelSubject = require('../models/subject');
const axios = require('axios');
const fetch = require('node-fetch')

const createSubject = async (req, res)=>{
    try{
        const {name} = req.body;
        const newSubject = new modelSubject({name});
        const savedSubject = await newSubject.save();

        res.status(201).json({ message: "Asignatura creada", subject: savedSubject });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getAllSubjects = async (req, res)=>{
    try{
        const subjects = await modelSubject.find();
        res.status(200).json(subjects);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};


const updateSubject = async (req, res)=>{
    try{
        const {id} = req.params;
        const subject = await modelSubject.findById(id);
        if(!subject){
            res.status(404).json({message: 'Subject not found'});
        } else {
            subject.monitor = req.body.monitor;
            await subject.save();
            res.status(200).json(subject);
        }
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {createSubject, getAllSubjects, updateSubject};