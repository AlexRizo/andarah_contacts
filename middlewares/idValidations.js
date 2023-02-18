import User from "../models/user.js";

const validateURLIdParam = async(req, res, next) => {
    const prospect = await User.findByPk(req.params.id);

    if (!prospect) {
        return res.redirect('/prospect-not-found')
    } else {
        next();
    }
}

export default validateURLIdParam;