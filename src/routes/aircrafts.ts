import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { deleteAircraft, getAircraft, getAircrafts, postAircraft, updateAircraft } from "../controllers/aircraft.controller";

const router = Router();

router.get('/', checkSession, getAircrafts);

router.post('/', checkSession, postAircraft);

router.get('/:id', checkSession, getAircraft);

router.put('/:id', checkSession, updateAircraft);

router.delete('/:id', checkSession, deleteAircraft);

export { router };