import { Request, Response } from "express";
import {
    addISAtable,
    addISAtableData,
    obtainClosestISAtable,
    obtainISAtable,
    obtainISAtables,
    putISAtable,
    removeISAtable
} from "../services/ISAtable.service";
import logger from "../config/logger";

const getISAtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainISAtable(id);
        logger.info(`ISA table retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getISAtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getISAtable: ${e}`);
    }
};

const getISAtables = async (_req: Request, res: Response) => {
    try {
        const response = await obtainISAtables();
        logger.info("All ISA tables retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getISAtables: ${e.stack || e}`);
        res.status(500).send(`Error getISAtables: ${e}`);
    }
};

const postISAtable = async (req: Request, res: Response) => {
    try {
        const isatable = req.body;
        const response = await addISAtable(isatable);
        logger.info(`ISA table created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postISAtable with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postISAtable: ${e}`);
    }
};

const updateISAtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const isatable = req.body;
        const response = await putISAtable(id, isatable);
        logger.info(`ISA table updated with id ${id}: ${JSON.stringify(isatable)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateISAtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateISAtable: ${e}`);
    }
};

const deleteISAtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeISAtable(id);
        logger.info(`ISA table deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteISAtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteISAtable: ${e}`);
    }
};

const addISAtableDataController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const isatableData = req.body;
        const response = await addISAtableData(id, isatableData);
        logger.info(`Data added to ISA table with id ${id}: ${JSON.stringify(isatableData)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in addISAtableDataController with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error addISAtableDataController: ${e}`);
    }
};

const getClosestISAtable = async (req: Request, res: Response) => {
    try {
        const altitudeFeet = req.body.altitudeFeet;
        const response = await obtainClosestISAtable(altitudeFeet);
        logger.info(`Closest ISA table obtained for altitude: ${altitudeFeet} feet`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getClosestISAtable with altitude ${req.body.altitudeFeet}: ${e.stack || e}`);
        res.status(500).json(`Error getClosestISAtable: ${e}`);
    }
};

export {
    getISAtable,
    getISAtables,
    postISAtable,
    updateISAtable,
    deleteISAtable,
    addISAtableDataController,
    getClosestISAtable
};
