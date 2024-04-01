import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { addData, deleteV2table, getV2table, getV2tables, postV2table, updateV2table } from "../controllers/v2table.controller";

const router = Router();

router.get('/', checkSession, getV2tables);

router.post('/', checkSession, postV2table);

router.get('/:id', checkSession, getV2table);

router.put('/:id', checkSession, updateV2table);

router.put('/:id/addData', checkSession, addData);

router.delete('/:id', checkSession, deleteV2table);

export { router };