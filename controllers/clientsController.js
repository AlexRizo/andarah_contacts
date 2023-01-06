import { response } from "express";
import Staff from "../models/staff.js";
import User from "../models/user.js";

export const postClientZapier = async(req, res) => {
    const userInfo = req.body;
    const zapierPass = req.header('zapierPass')

    if (zapierPass != process.env.ZAPIERKEY) {
        return res.status(400).json({ response: 'invalid ZAPIERKEY.' })
    }
    
    res.json({ response: 'Usuario agregado correctamente.' });
}

export const postClient = async(req, res) => {
    const data = req.body;

    console.log(data);
    
    await User.create(data);
    
    res.json({ response: 'Usuario añadido correctamente.' });
}

export const getClients = async(req, res) => {
    const data = await User.findAll({include: { model: Staff }});

    console.log(data);
    res.json({ clients:data })
}

export const addPage = async(req, res) => {
    const staff = await Staff.findAll();

    res.render('home/new', { staff });
}