import { Request, Response } from "express";
import { addAirport, obtainAirport, obtainAirports, putAirport, removeAirport } from "../services/airport.service";
import logger from "../config/logger";

const getAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainAirport(id);
        logger.info(`Airport retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getAirport with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getAirport: ${e}`);
    }
};

const getAirports = async (_req: Request, res: Response) => {
    try {
        const response = await obtainAirports();
        logger.info("All airports retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getAirports: ${e.stack || e}`);
        res.status(500).send(`Error getAirports: ${e}`);
    }
};

const postAirport = async (req: Request, res: Response) => {
    try {
        const airport = req.body;
        const response = await addAirport(airport);
        logger.info(`Airport created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postAirport with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postAirport: ${e}`);
    }
};

const updateAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const airport = req.body;
        const response = await putAirport(id, airport);
        logger.info(`Airport updated with id ${id}: ${JSON.stringify(airport)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateAirport with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateAirport: ${e}`);
    }
};

const deleteAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeAirport(id);
        logger.info(`Airport deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteAirport with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteAirport: ${e}`);
    }
};

export { getAirport, getAirports, postAirport, updateAirport, deleteAirport };
