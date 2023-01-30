import User from "../models/user.js";

export const emailUnique = async(email = '') => {
    const user = await User.findOne({
        where: { email }
    });

    if (user) {
        throw new Error('Ya existe una cuenta con esa dirección de correo');
    }
}