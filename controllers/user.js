const express = require('express');
const modelUser = require('../models/user');
const fetch = require('node-fetch');

// Obtener todos los movies
const getAllUsers = async (req, res)=>{
    try{
        const users = await modelUser.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {getAllUsers/*, updateUser , editUser */};