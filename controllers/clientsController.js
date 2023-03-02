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
    const { id, ...data } = req.body;

    
    if (!data.staffId) {
        data.staffId = null;
    }

    try {
        await User.update(data, { where: { 'id': id } });
        res.json({ response: 'Prospecto Actualizado.' });
    } catch (error) {
        return { error };
    }
}

export const addPage = async(req, res) => {
    const staff = await Staff.findAll({ where: { 'role': [2, 3] } });

    res.render('home/new', { staff });
}

export const prospectPage = async(req, res) => {
    const prospect = await User.findByPk(req.params.id, { include: { model: Staff } });
    const staff = await Staff.findAll();

    if (!prospect.Staff) {
        prospect.Staff = {
            id: 0,
            name: 'Sin Asignar',
        };
    }
    
    res.render('home/prospect', { prospect, staff });
}