import User from "../models/user.js";

export const emailUnique = async(email = '') => {
    const user = await User.findOne({
        where: { email }
    });

    if (user) {
        console.log('Ya existe una cuenta con ese correo.');
        return { error: 'Ya existe una cuenta con ese correo.' };
    }
}