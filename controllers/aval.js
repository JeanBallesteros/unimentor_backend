const express = require('express');
const modelUser = require('../models/user');
const modelAval = require('../models/aval');
const fetch = require('node-fetch');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

// Crear una instancia de Multer con la configuración de almacenamiento
// const upload = multer({ storage: storage }).single('file');

const avalUpload = async (req, res) => {
    try {

        const userId = req.params.id;
        
        const uploadLocalM = multer({
            storage: storage,
            fileFilter: function (req, file, cb) {
                // Filtra los archivos permitidos (puedes personalizar esto según tus necesidades)
                if (file.mimetype.startsWith('image/') || file.mimetype.includes('pdf')) {
                    cb(null, true);
                } else {
                    cb(new Error('Formato de archivo no válido. Solo se permiten imágenes y videos.'));
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // Tamaño máximo del archivo (aquí, 10 MB)
                files: 3, // Número máximo total de archivos (imágenes + videos)
                parts: 6
            }
        }).array('files', 3);
  
        // Llamar a la función de carga de Multer dentro del controlador
        await new Promise((resolve, reject) => {
            uploadLocalM(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
            });
        });
  
        const files = req.files; // Array con los archivos subidos

        console.log(files)
    
        // Verificar si se subieron exactamente 3 archivos
        if (files.length !== 3) {
            throw new Error('Debe subir exactamente 3 archivos.');
        }
  
        const fileDetails = files.map(file => ({
            message: 'Uploaded',
            id: file.id,
            name: file.filename,
            contentType: file.contentType,
        }));



        // Crear un nuevo documento de Aval
        const aval = new modelAval({
            idUsuario: userId, // Asigna el ID del usuario al documento de Aval
            promedio: files[0].filename, // Asigna el nombre del primer archivo subido a la propiedad "promedio"
            rut: files[1].filename, // Asigna el nombre del segundo archivo subido a la propiedad "rut"
            certificado: files[2].filename // Asigna el nombre del tercer archivo subido a la propiedad "certificado"
        });

        // Guardar el documento de Aval en la base de datos
        await aval.save();
  
        // Los archivos se cargaron con éxito.
        res.status(201).json({ message: 'Files uploaded successfully', fileDetails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {avalUpload};