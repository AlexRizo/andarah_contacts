import Staff from "../models/staff.js";
import Origin from "../models/origin.js";

export const home = async(req, res) => {
    const origins = await Origin.findAll();
    
    res.render('home/home', { origins });
}