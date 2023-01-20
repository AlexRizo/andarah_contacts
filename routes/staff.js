import { Router } from "express";
import { check } from "express-validator";
import { newStaff, profileView } from "../controllers/staffController.js";
import staffValidation from "../middlewares/staffPassValidation.js";
import validateFields from "../middlewares/validateFields.js";

const router = Router();

router.post('/create-new', [
    staffValidation,
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').not().isEmpty(),
    check('email', 'El email no es válido.').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields,
], newStaff);

router.get('/profile', profileView);

export default router;