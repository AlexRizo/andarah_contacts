import { encrypt } from "../helpers/handleBcrypt.js";
import Staff from "../models/staff.js";
import User from "../models/user.js";
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

export const profileView = async(req, res) => {
    const prospects = await User.findAndCountAll();
    const prosContacted = await User.findAndCountAll({ where: {'contact_status': 1 } })
    
    
    res.render('home/admin', { prospects, prosContacted });
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

export const singleStaffPage = async(req, res) => {
    const { id } = req.params;

    const staff = await Staff.findByPk(id);
    const roles = await Role.findAll();
    
    res.render('home/admin/edit', { staff, roles, id});
}

export const validateRole = async(req, res) => {
    const { id } = req.body;
    const staff = req.user; // user wich needs edit

    const user = await Staff.findByPk(id);

    if (user.roleId === 3 && staff.roleId < user.roleId) {
        return res.json({ status: false });
    }

    if (staff.roleId === 1) {
        return res.json({ status: false });
    }

    res.json({ status: true })
}