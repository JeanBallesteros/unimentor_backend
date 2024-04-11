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

module.exports = {createProgram};