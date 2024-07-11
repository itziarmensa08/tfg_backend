import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { addData, deleteVYtable, getClosestRows, getVYtable, getVYtableByAircraft, getVYtables, postVYtable, updateVYtable } from "../controllers/vYtable.controller";

const router = Router();

router.get('/', checkSession, getVYtables);

router.post('/', checkSession, postVYtable);

router.get('/:id', checkSession, getVYtable);

router.post('/filterData', checkSession, getClosestRows);

router.get('/aircraft/:id/:state', checkSession, getVYtableByAircraft);

router.put('/:id', checkSession, updateVYtable);

router.put('/:id/addData', checkSession, addData);

router.delete('/:id', checkSession, deleteVYtable);

export { router };