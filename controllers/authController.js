import Staff from "../models/staff.js";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/jwt.js";

export const login = async(req, res) => {
    const { email, password} = req.body;

    try {
        const user = await Staff.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: 'Correo / contraseña incorrectos.'});
        }

        const validPass = bcryptjs.compareSync(password, user.password);
        if (!validPass) {
            return res.status(400).json({ error: 'Correo / contraseña incorrectos.' });
        }

        if (!user.status) {
            return res.status(400).json({ error: 'Cuenta bloqueada.' });
        }

        const tkn = await generateJWT(user.id);

        res.json({ user, tkn });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Error with the server (resp: 500).'
        });
    }
}

export const renewTKN = async(req, res) => {
    const { user } = req;

    const tkn = await generateJWT(user.id);

    res.json({
        user,
        tkn
    });
}

export const loginPage = (req, res) => {
    res.render('auth/login');
}