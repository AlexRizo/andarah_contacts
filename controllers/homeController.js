import Staff from "../models/staff.js";

export const home = async(req, res) => {
    const staff = await Staff.findAll();
    
    res.render('home/home', { staff });
}