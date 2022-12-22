import User from "../models/user.js";

export const postClient = async(req, res) => {
    const userInfo = req.body;
    const zapierPass = req.header('zapierPass')

    if (!(zapierPass === process.env.ZAPIERKEY)) {
        return res.status(400).json({ response: 'invalid ZAPIERKEY.' })
    }
    
    console.log(userInfo);
    const user = await User.create(userInfo);
    
    res.json(user)
}