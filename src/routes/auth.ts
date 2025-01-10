import { Router } from "express";
import { forgotCtrl, loginCtrl, registerCtrl, resendCtrl, restoreCtrl, validateCtrl } from "../controllers/auth.controller";

const router = Router();

router.post('/register', registerCtrl);

router.post('/login', loginCtrl);

router.put('/validate/:id', validateCtrl);

router.put('/resend/validation', resendCtrl);

router.put('/forgot', forgotCtrl);

router.put('/restore/password/:id', restoreCtrl);

export { router };