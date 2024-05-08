import { Router } from "express";
import { addTaskUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";
import { checkSession } from "../middlewares/session.middleware";

const router = Router();

router.get('/', checkSession, getUsers);

router.get('/:id', checkSession, getUser);

router.put('/:id', checkSession, updateUser);

router.put('/tasks/:id', checkSession, addTaskUser);

router.delete('/:id', checkSession, deleteUser);

export { router };