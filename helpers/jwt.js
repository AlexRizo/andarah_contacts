import jwt from "jsonwebtoken";
import Staff from "../models/staff.js";

export const generateJWT = (id = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '24h'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject('No se pudo generar el token.');
            } else {
                resolve(token);
            }
        });
    });
}

export const validateJWT = async(tkn = '') => {
    try {
        if (tkn.length < 10) {
            return null;
        }

        const { id } = jwt.verify(tkn, process.env.SECRETORPRIVATEKEY);
        const user = await Staff.findByPk(id);
        
        if (user) {
            if (user.status) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}