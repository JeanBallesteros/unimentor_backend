/**
 * Controlador para manejar la subida de archivos de aval y la gestión de avales de usuarios.
 * @module avalController
 */

const express = require("express");
const modelUser = require("../models/user");
const modelAval = require("../models/aval");
const fetch = require("node-fetch");
const multer = require("multer");

/**
 * Función para manejar la subida de archivos de aval.
 * @function avalUpload
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP indicando éxito o fallo de la subida de archivos.
 */
const avalUpload = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await modelUser.findById(userId);
    const documentNumber = user.documentNumber;

    // Configuración de multer para el almacenamiento de archivos
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        cb(null, documentNumber + "-" + file.originalname);
      },
    });

    // Middleware de multer para la subida de archivos
    const uploadLocalM = multer({
      storage: storage,
      fileFilter: function (req, file, cb) {
        if (
          file.mimetype.startsWith("image/") ||
          file.mimetype.includes("pdf")
        ) {
          cb(null, true);
        } else {
          cb(
            new Error(
              "Formato de archivo no válido. Solo se permiten pdf e imágenes."
            )
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 3,
        parts: 6,
      },
    }).array("files", 3);

    // Ejecutar la subida de archivos
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

    // Verificar si se subieron exactamente 3 archivos
    if (files.length !== 3) {
      throw new Error("Debe subir exactamente 3 archivos.");
    }

    // Detalles de los archivos subidos
    const fileDetails = files.map((file) => ({
      message: "Uploaded",
      id: file.id,
      name: file.filename,
      contentType: file.contentType,
    }));

    // Crear un nuevo aval en la base de datos
    const aval = new modelAval({
      idUsuario: userId,
      promedio: files[0].filename,
      rut: files[1].filename,
      certificado: files[2].filename,
    });

    await aval.save();

    res.status(201).json({ message: "Files uploaded successfully", fileDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Función para obtener información de usuarios con avales.
 * @function avalUsers
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP con la información de usuarios y sus avales.
 */
const avalUsers = async (req, res) => {
  try {
    const avales = await modelAval.find();
    const avalUserIds = avales.map((aval) => aval.idUsuario);
    const result = await modelUser.aggregate([
      { $match: { role: { $ne: "master", $ne: "teacher" }, _id: { $in: avalUserIds } } },
      {
        $lookup: {
          from: "avals",
          localField: "_id",
          foreignField: "idUsuario",
          as: "avalsData",
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Función para obtener información de monitores con avales.
 * @function avalUsersMonitor
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP con la información de monitores y sus avales.
 */
const avalUsersMonitor = async (req, res) => {
  try {
    const avales = await modelAval.find();
    const avalUserIds = avales.map((aval) => aval.idUsuario);
    const result = await modelUser.aggregate([
      { $match: { role: "monitor" } },
      {
        $lookup: {
          from: "avals",
          localField: "_id",
          foreignField: "idUsuario",
          as: "avalsData",
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Función para eliminar un aval.
 * @function avalDelete
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP indicando éxito o fallo de la eliminación del aval.
 */
const avalDelete = async (req, res) => {
    try {
        const avalId = req.params.id;
        const aval = await modelAval.findById(avalId);
        await aval.deleteOne();
        res.status(200).json({ message: "Aval eliminado correctamente" });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Función para verificar si un usuario tiene un aval.
 * @function userIdInAval
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP indicando si el usuario tiene un aval asociado.
 */
const userIdInAval = async (req, res) => {
  try {
    const userId = req.params.id;
    const aval = await modelAval.findOne({ idUsuario: userId });
    if(aval){
      res.status(200).json({ message: "userId presente", aval });
    }else{
      res.status(200).json({ message: "userId no presente", aval });
    }
  }   catch (error) {
    res.status(500).json({ message: "Error al obtener el aval" });
  }
};

/**
 * Función para crear un nuevo aval.
 * @function createAval
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} Respuesta HTTP indicando éxito o fallo de la creación del aval.
 */
const createAval = async (req, res)=>{
  try{
      const {idUsuario, promedio, rut, certificado} = req.body;
      const newAval = new modelAval({idUsuario, promedio, rut, certificado});
      const savedAval = await newAval.save();

      res.status(201).json({ message: "Aval creado", Aval: savedAval });
  }catch(error){
      res.status(500).json({message: error.message});
  }
}

module.exports = { avalUpload, avalUsers, avalDelete, avalUsersMonitor, userIdInAval, createAval};
