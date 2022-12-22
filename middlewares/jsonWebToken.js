import jwt from "jsonwebtoken";
import Staff from "../models/staff.js";

const jsonWebToken = async(req, res, next) => {
    const tkn = req.header('tkn');

    if (!tkn) {
        return res.status(400).json({
            error: 'El token es obligatorio.',
        });
    }

    try {
        const { id } = jwt.verify(tkn, process.env.SECRETORPRIVATEKEY);

        const user = await Staff.findByPk(id);

        if (!user || !user.status) {
            return res.status(404).json({
                error: 'Token inválido'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: 'Token inválido'
        })
    }
}

export default jsonWebToken;