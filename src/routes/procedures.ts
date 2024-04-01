import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { deleteProcedure, getProcedure, getProcedures, postProcedure, updateProcedure } from "../controllers/procedure.controller";

const router = Router();

router.get('/', checkSession, getProcedures);

router.post('/', checkSession, postProcedure);

router.get('/:id', checkSession, getProcedure);

router.put('/:id', checkSession, updateProcedure);

router.delete('/:id', checkSession, deleteProcedure);

export { router };