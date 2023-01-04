import { Router } from "express";
import { check } from "express-validator";
import { getClients, postClient } from "../controllers/clientsController.js";
import jsonWebToken from "../middlewares/jsonWebToken.js";
import validateFields from "../middlewares/validateFields.js";

const router = Router();

router.post('/zapier/api', [ // TODO: This route is for Zapier;
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').not().isEmpty(),
    check('email', 'El email no es correcto.').isEmail(),
    check('city', 'la cuidad es obligatoria.').not().isEmpty(),
    check('phone_number', 'El teléfono es obligatorio.').not().isEmpty(),
    check('reason', 'El motivo es obligatorio.').not().isEmpty(),
    check('date_contact', 'la fecha de contacto es obligatoria.').not().isEmpty(),
    check('origin', 'El origen es obligatorio.').not().isEmpty(),
    check('pl', 'pl es obligatorio.').not().isEmpty(),
    check('gr', 'gr es obligatorio.').not().isEmpty(),
    validateFields
], postClient);

router.post('/new', [ // TODO: This route is for internal use;
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').not().isEmpty(),
    check('email', 'El email no es correcto.').isEmail(),
    check('city', 'la cuidad es obligatoria.').not().isEmpty(),
    check('phone_number', 'El teléfono es obligatorio.').not().isEmpty(),
    check('reason', 'El motivo es obligatorio.').not().isEmpty(),
    check('date_contact', 'la fecha de contacto es obligatoria.').not().isEmpty(),
    check('origin', 'El origen es obligatorio.').not().isEmpty(),
    check('pl', 'pl es obligatorio.').not().isEmpty(),
    check('gr', 'gr es obligatorio.').not().isEmpty(),
    validateFields
], postClient);

router.get('/get', jsonWebToken, getClients);

router.get('/add', (req, res) => {
    res.render('home/new')
});

export default router;