const express = require('express');
const modelUser = require('../models/user');
const modelAval = require('../models/aval');
const fetch = require('node-fetch');
const multer = require('multer');

const avalUpload = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await modelUser.findById(userId);
        const documentNumber = user.documentNumber;
        
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, 'uploads/');
            },
            filename: function (req, file, cb) {
              cb(null, documentNumber + '-' + file.originalname);
            }
        });
        
        const uploadLocalM = multer({
            storage: storage,
            fileFilter: function (req, file, cb) {
                if (file.mimetype.startsWith('image/') || file.mimetype.includes('pdf')) {
                    cb(null, true);
                } else {
                    cb(new Error('Formato de archivo no válido. Solo se permiten pdf e imágenes.'));
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024,
                files: 3,
                parts: 6
            }
        }).array('files', 3);

  
        await new Promise((resolve, reject) => {
            uploadLocalM(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
            });
        });
  
        const files = req.files;

        console.log(files)

        if (files.length !== 3) {
            throw new Error('Debe subir exactamente 3 archivos.');
        }
  
        const fileDetails = files.map(file => ({
            message: 'Uploaded',
            id: file.id,
            name: file.filename,
            contentType: file.contentType,
        }));

        const aval = new modelAval({
            idUsuario: userId, 
            promedio: files[0].filename, 
            rut: files[1].filename, 
            certificado: files[2].filename 
        });

        await aval.save();
  
        res.status(201).json({ message: 'Files uploaded successfully', fileDetails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {avalUpload};