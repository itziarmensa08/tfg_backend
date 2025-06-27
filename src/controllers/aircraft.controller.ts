import { Request, Response } from "express";
import { addAircraft, obtainAircraft, obtainAircrafts, putAircraft, removeAircraft } from "../services/aircraft.service";
import logger from "../config/logger";

const getAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainAircraft(id);
        logger.info(`Aircraft retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getAircraft with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getAircraft: ${e}`);
    }
};

const getAircrafts = async (_req: Request, res: Response) => {
    try {
        const response = await obtainAircrafts();
        logger.info("All aircrafts retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getAircrafts: ${e.stack || e}`);
        res.status(500).send(`Error getAircrafts: ${e}`);
    }
};

const postAircraft = async (req: Request, res: Response) => {
    try {
        const aircraft = req.body;
        const response = await addAircraft(aircraft);
        logger.info(`Aircraft created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postAircraft with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postAircraft: ${e}`);
    }
};

const updateAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const aircraft = req.body;
        const response = await putAircraft(id, aircraft);
        logger.info(`Aircraft updated with id ${id}: ${JSON.stringify(aircraft)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateAircraft with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateAircraft: ${e}`);
    }
};

const deleteAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeAircraft(id);
        logger.info(`Aircraft deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteAircraft with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteAircraft: ${e}`);
    }
};

export { getAircraft, getAircrafts, updateAircraft, deleteAircraft, postAircraft };
