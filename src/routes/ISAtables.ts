import { Router } from "express";
import { checkSession } from "../middlewares/session.middleware";
import { addISAtableDataController, deleteISAtable, getClosestISAtable, getISAtable, getISAtables, postISAtable, updateISAtable } from "../controllers/ISAtable.controller";

const router = Router();

router.get('/', checkSession, getISAtables);

router.post('/', checkSession, postISAtable);

router.get('/:id', checkSession, getISAtable);

router.post('/filterData', checkSession, getClosestISAtable);

router.put('/:id', checkSession, updateISAtable);

router.put('/:id/addData', checkSession, addISAtableDataController);

router.delete('/:id', checkSession, deleteISAtable);

export { router };
