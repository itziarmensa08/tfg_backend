import { Request, Response } from "express";
import {
    addVYtable,
    addVYtableRow,
    obtainClosestRows,
    obtainVYtable,
    obtainVYtableByAircraft,
    obtainVYtables,
    putVYtable,
    removeVYtable
} from "../services/vYtable.service";
import logger from "../config/logger";

const getVYtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainVYtable(id);
        logger.info(`VY table retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getVYtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getVYtable: ${e}`);
    }
};

const getVYtableByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const state = req.params.state;
        const response = await obtainVYtableByAircraft(id, state);
        logger.info(`VY table retrieved by aircraft id: ${id}, state: ${state}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getVYtableByAircraft with id ${req.params.id}, state ${req.params.state}: ${e.stack || e}`);
        res.status(500).json(`Error getVYtable: ${e}`);
    }
};

const getVYtables = async (_req: Request, res: Response) => {
    try {
        const response = await obtainVYtables();
        logger.info("All VY tables retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getVYtables: ${e.stack || e}`);
        res.status(500).send(`Error getVYtables: ${e}`);
    }
};

const postVYtable = async (req: Request, res: Response) => {
    try {
        const VYtable = req.body;
        const response = await addVYtable(VYtable);
        logger.info(`VY table created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postVYtable with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postVYtable: ${e}`);
    }
};

const updateVYtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VYtable = req.body;
        const response = await putVYtable(id, VYtable);
        logger.info(`VY table updated with id ${id}: ${JSON.stringify(VYtable)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateVYtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateVYtable: ${e}`);
    }
};

const deleteVYtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeVYtable(id);
        logger.info(`VY table deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteVYtable with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteVYtable: ${e}`);
    }
};

const addData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VYtabledata = req.body;
        const response = await addVYtableRow(id, VYtabledata);
        logger.info(`Row added to VY table ${id}: ${JSON.stringify(VYtabledata)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in addData for VY table ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateVYtable: ${e}`);
    }
};

const getClosestRows = async (req: Request, res: Response) => {
    try {
        const { pressure, grossWeight, idAircraft, state } = req.body;
        const response = await obtainClosestRows(pressure, grossWeight, idAircraft, state);
        logger.info(`Closest VY rows retrieved for aircraft ${idAircraft}, state ${state}, pressure ${pressure}, weight ${grossWeight}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getClosestRows with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error getClosestRows: ${e}`);
    }
};

export {
    getVYtable,
    getVYtables,
    postVYtable,
    updateVYtable,
    deleteVYtable,
    addData,
    getVYtableByAircraft,
    getClosestRows
};
