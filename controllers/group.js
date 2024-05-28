const express = require('express');
const modelUser = require('../models/user');
const modelGroup = require('../models/group');
const modelSubject = require('../models/subject');
const axios = require('axios');
const fetch = require('node-fetch');
const mongoose = require("mongoose")

/**
 * Crea un nuevo grupo
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const createGroup = async (req, res) => {
    try {
        const { name, subject, teacher } = req.body;
        const newGroup = new modelGroup({ name, subject, teacher });
        const savedGroup = await newGroup.save();

        res.status(201).json({ message: "Grupo creado", group: savedGroup });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Obtiene todos los grupos
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const getAllGroups = async (req, res) => {
    try {
        const groups = await modelGroup.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtiene un grupo por su ID
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const getGroup = async (req, res) => {
    try {
        const id = req.params.id;

        const group = await modelGroup.aggregate([
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
                    from: "users",
                    localField: "monitor",
                    foreignField: "_id",
                    as: "monitor"
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
                $match: {
                    "_id": new mongoose.Types.ObjectId(id)
                }
            }
        ]).exec();

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
        } else {
            res.status(200).json(group);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtiene todos los grupos que no tienen monitor asignado
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const getAllGroupsMonitorEmpty = async (req, res) => {
    try {
        const groupsWithSubjectsAndEmptyMonitor = await modelGroup.aggregate([
            {
                $lookup: {
                    from: "subjects",
                    localField: "subject",
                    foreignField: "_id",
                    as: "subject"
                }
            },
            {
                $match: {
                    monitor: null
                }
            }
        ]).exec();

        res.status(200).json(groupsWithSubjectsAndEmptyMonitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtiene todos los grupos con monitor asignado
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const getNotEmpty = async (req, res) => {
    try {
        const groupsWithSubjectsAndNotEmptyMonitor = await modelHourLog.find();
        res.status(200).json(groupsWithSubjectsAndNotEmptyMonitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtiene todos los grupos con monitor asignado y sus detalles
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const getAllGroupsMonitorNotEmpty = async (req, res) => {
    try {
        const { id } = req.params;

        const groupsWithSubjectsAndNotEmptyMonitor = await modelGroup.aggregate([
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
                    from: "users",
                    localField: "monitor",
                    foreignField: "_id",
                    as: "monitor"
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
                $match: {
                    "monitor": { $ne: [] }
                }
            }
        ]).exec();

        res.status(200).json(groupsWithSubjectsAndNotEmptyMonitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Actualiza un grupo asignándole un monitor
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await modelGroup.findById(id);
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
        } else {
            group.monitor = mongoose.Types.ObjectId.createFromHexString(req.body.monitor);
            await group.save();
            res.status(200).json(group);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Actualiza un grupo asignando el monitor a null
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const updateGroupToNull = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await modelGroup.findById(id);
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
        } else {
            group.monitor = null;
            await group.save();
            res.status(200).json(group);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtiene todos los grupos en los que un monitor específico está asignado
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const getAllGroupsMonitor = async (req, res) => {
    try {
        const { id } = req.params;

        const groupsWithSubjectsAndMonitor = await modelGroup.aggregate([
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
                    from: "users",
                    localField: "monitor",
                    foreignField: "_id",
                    as: "monitor"
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
                $match: {
                    "monitor._id": new mongoose.Types.ObjectId(id)
                }
            }
        ]).exec();

        res.status(200).json(groupsWithSubjectsAndMonitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createGroup, 
    getAllGroups, 
    getGroup, 
    updateGroup, 
    getAllGroupsMonitorEmpty, 
    getAllGroupsMonitorNotEmpty, 
    updateGroupToNull, 
    getAllGroupsMonitor, 
    getNotEmpty 
};
