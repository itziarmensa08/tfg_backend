import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { calculateGradient, deleteGradientGraphic, getGradientGraphic, getGradientGraphicByAircraft, getGradientGraphics, postGradientGraphic, postGradientLine, updateGradientGraphic } from "../controllers/gradientGraphic.controller";

const router = Router();

router.get('/', checkSession, getGradientGraphics);

router.post('/', checkSession, postGradientGraphic);

router.get('/:id', checkSession, getGradientGraphic);

router.get('/aircraft/:id/:segment', checkSession, getGradientGraphicByAircraft);

router.put('/:id', checkSession, updateGradientGraphic);

router.put('/:id/addGradientLine', checkSession, postGradientLine);

router.delete('/:id', checkSession, deleteGradientGraphic);

router.post('/calculate/gradient/:id', checkSession, calculateGradient);

export { router };