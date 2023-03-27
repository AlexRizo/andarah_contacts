import { Socket } from "socket.io";
import { validateJWT } from "../helpers/jwt.js";
import Staff from "../models/staff.js";
import User from '../models/user.js'
import jwt from "jsonwebtoken";
import { encrypt } from "../helpers/handleBcrypt.js";

// Validar JWT
const jsonWebToken = async(token) => {
    try {
        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const staff = await Staff.findByPk(id);

        if (!staff) {
            return { error: 'Error 403: Forbidden.'};
        }

        return { staff: staff.roleId, id };
    } catch (error) {
        return { error }
    }
}

// : Admin section:
const updateTableUsers = async() => {
    return await User.findAll({ include: { model: Staff }, order: [['contact_status', 'ASC']] });
}

const updateTableStaff = async(role) => {
    let users;

    if (role != 1) {
        users = await Staff.findAll({ where: { 'roleId': [2, 3] } , order: [['roleId', 'DESC']] });

        return users;
    }

    return users = await Staff.findAll({ order: [['roleId', 'DESC']] });
}

// : obtener prospectos dependiendo de tu user.role:
const getProspectsAsignedTo = async(isStaff, value) => {
    if (!isStaff) {
        return await User.findAndCountAll({ where: { 'staffId': value, 'contact_status': false } });
    } else {
        return await User.findAndCountAll({ where: { 'staffId': value } });
    }    
}

// : Actualizar Staff
const staffUpdate = async(data) => {
    const {id, password, roleId, ...$data} = data;
    const staff = await Staff.findByPk(id);
    
    if (!staff){
        return false;
    }

    if(roleId != "null"){
        $data.roleId = roleId;
    }
    
    if (password) {
        $data.password = encrypt(password);
    }

    await Staff.update($data, { where: { 'id': id } });
    return true;
}


// TODO: SocketController:
const socketController = async(socket = new Socket(), io) => {
    const user = await validateJWT(socket.handshake.headers['tkn']);
    if (!user) {
        return socket.disconnect();
    }

    // Connect user to private room for notifications push.
    socket.join(`r${user.id}`);

    socket.on('get-users', async({ Urole }) => {
        io.emit('get-staff-data', { salers: await updateTableStaff(Urole) });
    });

    socket.on('get-client-data', async({ id }) => {
        const client = await User.findByPk(id);
        socket.emit('client-sndd', { client })
    });

    socket.on('delete-client', async({ id }) => {
        await User.destroy({ where: { 'id': id } });

        io.emit('update-table', { clients: await updateTableUsers() });
    });

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
    });

    socket.on('new-client', async({ status }) => {
        io.emit('update-table', { clients: await updateTableUsers() }); 
    });

    socket.on('send-notification', ({ id, msg = "Se te ha asignado un nuevo cliente." }) => {
        socket.to(`r${id}`).emit('notification', { msg });
    });

    socket.on('update-prospects-asigned', async({ status }) => {
        io.emit('prospects-modified', { status });
    });

    // : Update prospects asigned when the primary table is modified:
    socket.on('get-new-prospects', async({ token }) => {
        const response = await jsonWebToken(token);
        if (response.error) {
            return console.log(response.error);
        } else {
            if (response.staff === 3) {
                return socket.emit('prospects-asigned', { prospects: await getProspectsAsignedTo(false, response.id) });
            } else {
                return socket.emit('prospects-asigned', { prospects: await getProspectsAsignedTo(true, 0) });
            }
        }
    });

    // : Prospects asigned to:
    socket.on('get-prospects-asigned', async({ token }) => {
        const response = await jsonWebToken(token);
        if (response.error) {
            return console.log(response.error);
        } else {
            if (response.staff === 1) {
                return socket.emit('prospects-asigned', { prospects: await getProspectsAsignedTo(false, response.id) });
            } else {
                return socket.emit('prospects-asigned', { prospects: await getProspectsAsignedTo(true, null), admin: true });
            }
        }
    });

    // : get all prespects with a counter: (6, 10, 190, etc.):
    socket.on('get-all-prospects', async({ token }) => {
        const response = jsonWebToken(token);

        if (response.error) {
            return console.log(response.error);
        }

        const prospects = await User.findAndCountAll();

        return socket.emit('all-prospects', { prospects });
    });

    // : update prospect:
    socket.on('update-prospect', async({ formData }) => {
        if (!formData.staffId) {
            formData.staffId = 'null';
        }
    });

    // Editar Staff:
    socket.on('send-admin-data', async({ formData }) => {
        const resp = await staffUpdate(formData);
        
        if (resp) {
            socket.emit('staff-update-response', { response: 'Usuario actualizado correctamente.', stat: true });
        } else {
            socket.emit('staff-update-response', { response: 'Ha ocurrido un error, inténtelo de nuevo.', stat: false });
        }
    });
}

export default socketController;