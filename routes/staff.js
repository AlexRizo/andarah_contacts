import { Router } from "express";
import { check } from "express-validator";
import { getSalers, newStaff, profileView } from "../controllers/staffController.js";
import staffValidation from "../middlewares/staffPassValidation.js";
import validateFields from "../middlewares/validateFields.js";
import jsonWebToken from "../middlewares/jsonWebToken.js";

const router = Router();

router.post('/create-new', [
    jsonWebToken,
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').not().isEmpty(),
    check('email', 'El email no es válido.').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields,
], newStaff);

router.get('/config', profileView);

router.get('/get-salers', jsonWebToken, getSalers);

export default router;