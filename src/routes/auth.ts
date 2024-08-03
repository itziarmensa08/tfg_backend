import { Router } from "express";
import { loginCtrl, registerCtrl, validateCtrl } from "../controllers/auth.controller";

const router = Router();

router.post('/register', registerCtrl);

router.post('/login', loginCtrl);

router.put('/validate/:id', validateCtrl);

export { router };