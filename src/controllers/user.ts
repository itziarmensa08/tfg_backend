import { Request, Response } from "express"
import { obtainUser, obtainUsers, putUser, removeUser } from "../services/user"

const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainUser(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getUser: ${e}`)
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const response = await obtainUsers();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getUsers: ${e}`)
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = req.body;
        const response = await putUser(id, user);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateUser: ${e}`)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeUser(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteUser: ${e}`)
    }
}

export {getUser, getUsers, updateUser, deleteUser};