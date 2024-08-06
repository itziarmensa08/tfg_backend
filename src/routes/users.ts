import { Router } from "express";
import { addTaskUser, completeTaskUser, deleteUser, getUser, getUsers, sendRemindTask, updateUser } from "../controllers/user.controller";
import { checkSession } from "../middlewares/session.middleware";

const router = Router();

router.get('/', checkSession, getUsers);

router.get('/:id', checkSession, getUser);

router.put('/:id', checkSession, updateUser);

router.post('/tasks', checkSession, sendRemindTask);

router.put('/tasks/:id', checkSession, addTaskUser);

router.put('/tasks/:idUser/:idTask', checkSession, completeTaskUser);

router.delete('/:id', checkSession, deleteUser);

export { router };