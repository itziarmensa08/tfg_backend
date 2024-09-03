import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { deleteProcedure, getAircraftsByAirport, getAirportsWithProcedures, getProcedure, getProcedures, getProceduresByAirportAndAircraft, postProcedure, updateProcedure } from "../controllers/procedure.controller";

const router = Router();

router.get('/', checkSession, getProcedures);

router.post('/', checkSession, postProcedure);

router.get('/:id', checkSession, getProcedure);

router.put('/:id', checkSession, updateProcedure);

router.delete('/:id', checkSession, deleteProcedure);

router.get('/list/airports', checkSession, getAirportsWithProcedures);

router.get('/list/aircrafts/:id', checkSession, getAircraftsByAirport);

router.get('/list/airport/:idAirport/aircraft/:idAircraft', checkSession, getProceduresByAirportAndAircraft);

export { router };