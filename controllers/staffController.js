import { encrypt } from "../helpers/handleBcrypt.js";
import Staff from "../models/staff.js";
import Role from "../models/role.js";

export const newStaff = async(req, res) => {
    const userInfo = req.body;

    try {
        userInfo.password = encrypt(userInfo.password);
        await Staff.create(userInfo);
        
        res.json({ response: 'Usuario creado correctamente.' });        
    } catch (error) {
        res.json(
            {
                response: 'Ha ocurrido un error',
                error
            });
    }
}

export const profileView = (req, res) => {
    res.render('home/admin');
}

export const getSalers = async(req, res) => {
    const { roleId } = req.user;
    let users;

    if (roleId != 3) {
        users = await Staff.findAll({ where: { 'roleId': [1, 2] }, order: [['roleId', 'DESC']], include: { model: Role } });

        return res.json({ salers:users, role:roleId });
    }

    users = await Staff.findAll({ order: [['roleId', 'DESC']], include: { model: Role } });

    res.json({ salers:users, role:roleId });
}