import Staff from "../models/staff.js";

export const home = async(req, res) => {
    const staff = await Staff.findAll({ where: { 'roleId': [2, 3] } });
    
    res.render('home/home', { staff });
}