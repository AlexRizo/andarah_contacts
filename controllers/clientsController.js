import { response } from "express";
import Staff from "../models/staff.js";
import User from "../models/user.js";

export const postClientZapier = async(req, res) => {
    const userInfo = req.body;
    const zapierPass = req.header('zapierPass')

    if (zapierPass != process.env.ZAPIERKEY) {
        return res.status(400).json({ response: 'invalid ZAPIERKEY.' })
    }

    await User.create(userInfo);
    
    res.json({ response: 'Usuario agregado correctamente.' });
}

export const postClient = async(req, res) => {
    const data = req.body;
    
    await User.create(data);
    
    res.json({ response: 'Usuario añadido correctamente.' });
}

export const getClients = async(req, res) => {
    const data = await User.findAll({include: { model: Staff }, order: [['contact_status', 'ASC']] });

    res.json({ clients:data })
}

export const updateClient = async(req, res) => {
    const {id, ...data} = req.body;

    await User.update(data, { where: { 'id': id } });

    const clients = await User.findAll({include: { model: Staff }});
        
    res.json({ clients });
}

export const addPage = async(req, res) => {
    const staff = await Staff.findAll({ where: { 'role': [2, 3] } } );
    const origins = await Staff.findAll({ where: { 'role': [2, 3] } } );

    res.render('home/new', { staff });
}