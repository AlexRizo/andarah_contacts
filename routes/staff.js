import { Router } from "express";
import { check } from "express-validator";
import { getSalers, newStaff, profileView, singleStaffPage, validateRole} from "../controllers/staffController.js";
import staffValidation from "../middlewares/staffPassValidation.js";
import validateFields from "../middlewares/validateFields.js";
import jsonWebToken from "../middlewares/jsonWebToken.js";
import { emailUnique } from "../helpers/dbValidations.js";
import { validateURLStaffIdParam } from "../middlewares/idValidations.js";

const router = Router();

router.post('/create-new', [
    jsonWebToken,
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').not().isEmpty(),
    check('email', 'El email no es válido.').isEmail(),
    check('email'). custom(emailUnique),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields,
], newStaff);

router.get('/config', profileView);

router.get('/view/user/:id', validateURLStaffIdParam, singleStaffPage);

router.get('/get-salers', jsonWebToken, getSalers);

router.post('/validate-role', jsonWebToken, validateRole)

export default router;