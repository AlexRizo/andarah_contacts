import Staff from "../models/staff.js";
import User from "../models/user.js";

export const validateURLPropsectIdParam = async(req, res, next) => {
    const prospect = await User.findByPk(req.params.id);

    if (!prospect) {
        return res.redirect('/prospect-not-found')
    } else {
        next();
    }
}

export const validateURLStaffIdParam = async(req, res, next) => {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
        return res.redirect('/user-not-found')
    } else {
        next();
    }
}