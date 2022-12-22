import { encrypt } from "../helpers/handleBcrypt.js";
import Staff from "../models/staff.js";

export const newStaff = async(req, res) => {
    const userInfo = req.body;

    try {
        userInfo.password = encrypt(userInfo.password);
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