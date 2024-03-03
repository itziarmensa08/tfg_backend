import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { deleteAirport, getAirport, getAirports, postAirport, updateAirport } from "../controllers/airport.controller";

const router = Router();

router.get('/', checkSession, getAirports);

router.post('/', checkSession, postAirport);

router.get('/:id', checkSession, getAirport);

router.put('/:id', checkSession, updateAirport);

router.delete('/:id', checkSession, deleteAirport);

export { router };