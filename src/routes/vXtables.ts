import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { addData, deleteVXtable, getClosestRows, getVXtable, getVXtableByAircraft, getVXtables, postVXtable, updateVXtable } from "../controllers/vXtable.controller";

const router = Router();

router.get('/', checkSession, getVXtables);

router.post('/', checkSession, postVXtable);

router.get('/:id', checkSession, getVXtable);

router.post('/filterData', checkSession, getClosestRows);

router.get('/aircraft/:id/:state', checkSession, getVXtableByAircraft);

router.put('/:id', checkSession, updateVXtable);

router.put('/:id/addData', checkSession, addData);

router.delete('/:id', checkSession, deleteVXtable);

export { router };