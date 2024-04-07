import { Request, Response } from "express"
import { addISAtable, addISAtableData, obtainClosestISAtable, obtainISAtable, obtainISAtables, putISAtable, removeISAtable } from "../services/ISAtable.service";

const getISAtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainISAtable(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getISAtable: ${e}`)
    }
}

const getISAtables = async (req: Request, res: Response) => {
    try {
        const response = await obtainISAtables();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getISAtables: ${e}`)
    }
}

const postISAtable = async (req: Request, res: Response) => {
    try {
        const isatable = req.body;
        const response = await addISAtable(isatable);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postISAtable: ${e}`)
    }
}

const updateISAtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const isatable = req.body;
        const response = await putISAtable(id, isatable);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateISAtable: ${e}`)
    }
}

const deleteISAtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeISAtable(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteISAtable: ${e}`)
    }
}

const addISAtableDataController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const isatableData = req.body;
        const response = await addISAtableData(id, isatableData);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error addISAtableDataController: ${e}`)
    }
}

const getClosestISAtable = async (req: Request, res: Response) => {
    try {
        const altitudeFeet = req.body.altitudeFeet;
        const pressure = req.body.pressure;
        const response = await obtainClosestISAtable(altitudeFeet, pressure);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getClosestISAtable: ${e}`)
    }
}

export { getISAtable, getISAtables, postISAtable, updateISAtable, deleteISAtable, addISAtableDataController, getClosestISAtable };
