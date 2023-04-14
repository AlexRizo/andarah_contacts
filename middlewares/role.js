import Staff from "../models/staff.js";

export const role = (req, res, next) => {
    const {urle:role, uid} = req.query;
    
    if (role === 1 || !role) {
        return res.status(401).redirect(`/401`);
    }

    const user = Staff.findByPk(uid);

    if (!user || user.roleId != role) {
        return res.status(403).redirect(`/403`);
    }
    
    next();
}