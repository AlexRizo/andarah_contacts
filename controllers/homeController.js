import Origin from "../models/origin.js";
import { validateJWT } from "../helpers/jwt.js";

export const home = async(req, res) => {
    const origins = await Origin.findAll();
    
    res.render('home/home', { origins });
}