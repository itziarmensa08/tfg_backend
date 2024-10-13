import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import {
    deleteCrewProcedure,
    getCrewProcedure,
    getCrewProcedures,
    postCrewProcedure,
    updateCrewProcedure
} from "../controllers/crewProcedure.controller";

const router = Router();

router.get('/', checkSession, getCrewProcedures);

router.post('/', checkSession, postCrewProcedure);

router.get('/:id', checkSession, getCrewProcedure);

router.put('/:id', checkSession, updateCrewProcedure);

router.delete('/:id', checkSession, deleteCrewProcedure);

export { router };
