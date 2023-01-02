import { Router } from "express";
import { home } from "../controllers/homeController.js";

const router = Router();

router.get('/home', home);

export default router;