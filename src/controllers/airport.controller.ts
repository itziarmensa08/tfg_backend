import { Request, Response } from "express"
import { addAirport, obtainAirport, obtainAirports, putAirport, removeAirport } from "../services/airport.service";

const getAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainAirport(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getAirport: ${e}`)
    }
}

const getAirports = async (req: Request, res: Response) => {
    try {
        const response = await obtainAirports();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getAirports: ${e}`)
    }
}

const postAirport = async (req: Request, res: Response) => {
    try {
        const airport = req.body;
        const response = await addAirport(airport);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postAirport: ${e}`)
    }
}

const updateAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const airport = req.body;
        const response = await putAirport(id, airport);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateAirport: ${e}`)
    }
}

const deleteAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeAirport(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteAirport: ${e}`)
    }
}

export {getAirport, getAirports, postAirport, updateAirport, deleteAirport};