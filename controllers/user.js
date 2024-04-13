const express = require('express');
const modelUser = require('../models/user');
const fetch = require('node-fetch');
const multer = require('multer');

const getAllUsers = async (req, res)=>{
    try{
        const users = await modelUser.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const updateUser = async (req, res)=>{
    try{
        const {id} = req.params;
        const user = await modelUser.findById(id);
        if(!user){
            res.status(404).json({message: 'User not found'});
        } else {
            user.role = req.body.role;
            await user.save();
            res.status(200).json(user);
        }
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = {getAllUsers, updateUser};