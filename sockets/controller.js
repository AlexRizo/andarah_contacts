import { Socket } from "socket.io";
import { validateJWT } from "../helpers/jwt.js";

const socketController = async(socket = new Socket(), io) => {
    const user = await validateJWT(socket.handshake.headers['tkn']);

    if (!user) {
        return socket.disconnect();
    }
}

export default socketController;