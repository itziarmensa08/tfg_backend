import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { deleteRateOfClimbGraphic, getRateOfClimbGraphic, getRateOfClimbGraphicByAircraft, getRateOfClimbGraphics, postPressureLine, postRateOfClimbGraphic, postWeightLine, updateRateOfClimbGraphic } from "../controllers/rateOfClimb.controller";

const router = Router();

router.get('/', checkSession, getRateOfClimbGraphics);

router.post('/', checkSession, postRateOfClimbGraphic);

router.get('/:id', checkSession, getRateOfClimbGraphic);

router.get('/aircraft/:id', checkSession, getRateOfClimbGraphicByAircraft);

router.put('/:id', checkSession, updateRateOfClimbGraphic);

router.put('/:id/addPressureLine', checkSession, postPressureLine);

router.put('/:id/add/WeightLine', checkSession, postWeightLine);

router.delete('/:id', checkSession, deleteRateOfClimbGraphic);

export { router };