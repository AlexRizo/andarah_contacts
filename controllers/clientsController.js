import Staff from "../models/staff.js";
import User from "../models/user.js";

export const postClient = async(req, res) => {
    const userInfo = req.body;
    const zapierPass = req.header('zapierPass')

    if (zapierPass != process.env.ZAPIERKEY) {
        return res.status(400).json({ response: 'invalid ZAPIERKEY.' })
    }
    
    console.log(userInfo);
    // const user = await User.create(userInfo);
    
    res.json({response: 'Usuario agregado correctamente.'});
}

export const getClients = async(req, res) => {
    const data = await User.findAll({include: { model: Staff }});

    console.log(data);
    res.json({ clients:data })
}