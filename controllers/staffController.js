import { encrypt } from "../helpers/handleBcrypt.js";
import Staff from "../models/staff.js";

export const newStaff = async(req, res) => {
    const userInfo = req.body;
    const { role } = req.user;

    try {
        userInfo.password = encrypt(userInfo.password);

        switch (role) {
            case 1:
                userInfo.role = 2;    
            break;
            case 2:
                userInfo.role = 3;    
            break;
        }
        
        await Staff.create(userInfo);
    } catch (error) {
        res.json(
            {
                response: 'Ha ocurrido un error',
                error
            });
    }

    res.json({ response: 'Usuario creado correctamente.' });
}

export const profileView = (req, res) => {
    res.render('home/config');
}

export const getSalers = async(req, res) => {
    const { role } = req.user;
    let users;

    if (role != 1) {
        users = await Staff.findAll({ where: { 'role': [2, 3] }, order: [['role', 'DESC']] });

        return res.json({ salers:users });
    }

    users = await Staff.findAll({ order: [['role', 'DESC']] });

    res.json({ salers:users, role });
}