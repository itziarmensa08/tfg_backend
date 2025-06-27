import { Request, Response } from "express";
import {
    addCrewProcedure,
    obtainCrewProcedure,
    obtainCrewProcedures,
    putCrewProcedure,
    removeCrewProcedure
} from "../services/crewProcedure.service";
import logger from "../config/logger";

const getCrewProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainCrewProcedure(id);
        logger.info(`Crew procedure retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getCrewProcedure with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getCrewProcedure: ${e}`);
    }
};

const getCrewProcedures = async (_req: Request, res: Response) => {
    try {
        const response = await obtainCrewProcedures();
        logger.info("All crew procedures retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getCrewProcedures: ${e.stack || e}`);
        res.status(500).send(`Error getCrewProcedures: ${e}`);
    }
};

const postCrewProcedure = async (req: Request, res: Response) => {
    try {
        const crewProcedure = req.body;
        const response = await addCrewProcedure(crewProcedure);
        logger.info(`Crew procedure created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postCrewProcedure with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postCrewProcedure: ${e}`);
    }
};

const updateCrewProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const crewProcedure = req.body;
        const response = await putCrewProcedure(id, crewProcedure);
        logger.info(`Crew procedure updated with id ${id}: ${JSON.stringify(crewProcedure)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateCrewProcedure with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateCrewProcedure: ${e}`);
    }
};

const deleteCrewProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeCrewProcedure(id);
        logger.info(`Crew procedure deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteCrewProcedure with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteCrewProcedure: ${e}`);
    }
};

export {
    getCrewProcedure,
    getCrewProcedures,
    postCrewProcedure,
    updateCrewProcedure,
    deleteCrewProcedure
};
