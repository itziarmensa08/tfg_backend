import { Request, Response } from "express"
import { addAircraft, obtainAircraft, obtainAircrafts, putAircraft, removeAircraft } from "../services/aircraft.service";

const getAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainAircraft(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getAircraft: ${e}`)
    }
}

const getAircrafts = async (req: Request, res: Response) => {
    try {
        const response = await obtainAircrafts();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getAircrafts: ${e}`)
    }
}

const postAircraft = async (req: Request, res: Response) => {
    try {
        const aircraft = req.body;
        const response = await addAircraft(aircraft);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error postAircraft: ${e}`)
    }
}

const updateAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const aircraft = req.body;
        const response = await putAircraft(id, aircraft);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateAircraft: ${e}`)
    }
}

const deleteAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeAircraft(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteAircraft: ${e}`)
    }
}

export {getAircraft, getAircrafts, updateAircraft, deleteAircraft, postAircraft};