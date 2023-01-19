const staffValidation = async(req, res, next) => {
    const staffkey = req.header('staffkey');

    if (!staffkey) {
        return res.status(400).json({
            error: 'Acceso denegado.',
        });
    }

    try {
        if (staffkey != process.env.STAFFKEY) {
            return res.status(400).json({
                error: 'Acceso denegado.'
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: 'Ha ocurrido un error |.'
        })
    }
}

export default staffValidation;