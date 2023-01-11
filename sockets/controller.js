import { Socket } from "socket.io";
import { validateJWT } from "../helpers/jwt.js";
import Staff from "../models/staff.js";
import User from '../models/user.js'

const socketController = async(socket = new Socket(), io) => {
    const user = await validateJWT(socket.handshake.headers['tkn']);

    if (!user) {
        return socket.disconnect();
    }

    socket.on('get-client-data', async({ id }) => {
        console.log(id);
        const client = await User.findByPk(id);
        socket.emit('client-sndd', { client })
    })

    socket.on('delete-client', async({ id }) => {
        await User.destroy({ where: { 'id': id } });

        const clients = await User.findAll({ include: { model: Staff } });

        io.emit('confirm-delete', { clients });
    })
}

export default socketController;