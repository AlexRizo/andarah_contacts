import { Router } from "express";
import { check } from "express-validator";
import { login, renewTKN } from "../controllers/authController.js";
import jsonWebToken from "../middlewares/jsonWebToken.js";
import validateFields from "../middlewares/validateFields.js";

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

router.get('/', jsonWebToken, renewTKN);

export default router;