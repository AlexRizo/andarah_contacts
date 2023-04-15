import { validateJWT } from "../helpers/jwt.js";

export const role = async(req, res, next) => {
    const { tkn } = req.query;

    const user = await validateJWT(tkn);

    console.log(user);
    
    if (!user || user.roleId === 1 || !user.roleId) {
        return res.status(403).redirect(`/403`);
    }
    
    next();
}