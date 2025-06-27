import { Request, Response } from "express";
import {
    addVXtable,
    addVXtableRow,
    obtainClosestRowsVX,
    obtainVXtable,
    obtainVXtableByAircraft,
    obtainVXtables,
    putVXtable,
    removeVXtable
} from "../services/vXtable.service";
import logger from "../config/logger";

const getVXtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainVXtable(id);
        logger.info(`VX table retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getVXtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getVXtable: ${e}`);
    }
};

const getVXtableByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const state = req.params.state;
        const response = await obtainVXtableByAircraft(id, state);
        logger.info(`VX table retrieved by aircraft id: ${id}, state: ${state}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getVXtableByAircraft with id ${req.params.id}, state ${req.params.state}: ${e.stack || e}`);
        res.status(500).json(`Error getVXtable: ${e}`);
    }
};

const getVXtables = async (_req: Request, res: Response) => {
    try {
        const response = await obtainVXtables();
        logger.info("All VX tables retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getVXtables: ${e.stack || e}`);
        res.status(500).send(`Error getVXtables: ${e}`);
    }
};

const postVXtable = async (req: Request, res: Response) => {
    try {
        const VXtable = req.body;
        const response = await addVXtable(VXtable);
        logger.info(`VX table created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postVXtable with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postVXtable: ${e}`);
    }
};

const updateVXtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VXtable = req.body;
        const response = await putVXtable(id, VXtable);
        logger.info(`VX table updated with id ${id}: ${JSON.stringify(VXtable)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateVXtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateVXtable: ${e}`);
    }
};

const deleteVXtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeVXtable(id);
        logger.info(`VX table deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteVXtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteVXtable: ${e}`);
    }
};

const addData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VXtabledata = req.body;
        const response = await addVXtableRow(id, VXtabledata);
        logger.info(`Row added to VX table ${id}: ${JSON.stringify(VXtabledata)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in addData for VX table ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateVXtable: ${e}`);
    }
};

const getClosestRows = async (req: Request, res: Response) => {
    try {
        const { pressure, grossWeight, idAircraft, state } = req.body;
        const response = await obtainClosestRowsVX(pressure, grossWeight, idAircraft, state);
        logger.info(`Closest VX rows retrieved for aircraft ${idAircraft}, state ${state}, pressure ${pressure}, weight ${grossWeight}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getClosestRowsVX with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error getClosestRowsVX: ${e}`);
    }
};

export {
    getVXtable,
    getVXtables,
    postVXtable,
    updateVXtable,
    deleteVXtable,
    addData,
    getVXtableByAircraft,
    getClosestRows
};
