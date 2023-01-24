import { Socket } from "socket.io";
import { validateJWT } from "../helpers/jwt.js";
import Staff from "../models/staff.js";
import User from '../models/user.js'

const updateTableUsers = async() => {
    return await User.findAll({ include: { model: Staff } });
}

const updateTableStaff = async(role) => {
    let users;

    if (role != 1) {
        users = await Staff.findAll({ where: { 'role': [2, 3] } , order: [['role', 'DESC']] });

        return users;
    }

    return users = await Staff.findAll({ order: [['role', 'DESC']] });
}

const socketController = async(socket = new Socket(), io) => {
    const user = await validateJWT(socket.handshake.headers['tkn']);

    if (!user) {
        return socket.disconnect();
    }

    socket.on('get-users', async({ Urole }) => {
        io.emit('get-staff-data', { salers: await updateTableStaff(Urole) });
    })

    socket.on('get-client-data', async({ id }) => {
        const client = await User.findByPk(id);
        socket.emit('client-sndd', { client })
    })

    socket.on('delete-client', async({ id }) => {
        await User.destroy({ where: { 'id': id } });

        io.emit('update-table', { clients: await updateTableUsers() });
    })

    socket.on('row-checked', async({ id }) => {
        let user = await User.findByPk(id);
        let status = new Boolean();

        if (!user) {
            return { error: 'Error 500' };
        }
        
        if (user.contact_status) {
            status = 0;
        } else {
            status = 1;
        }

        await User.update({ 'contact_status': status }, { where: { 'id': id } });

        io.emit('update-table', { clients: await updateTableUsers() });
    })

    socket.on('new-client', async({ status }) => {
        console.log(status);
        io.emit('update-table', { clients: await updateTableUsers() });
    })
}

export default socketController;