import { Request, Response } from "express";
import {
    addV2table,
    addV2tableRow,
    addV2tableRowData,
    obtainClosestRows,
    obtainV2table,
    obtainV2tableByAircraft,
    obtainV2tables,
    putV2table,
    removeV2table
} from "../services/v2table.service";
import logger from "../config/logger";

const getV2table = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainV2table(id);
        logger.info(`V2 table retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getV2table with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getV2table: ${e}`);
    }
};

const getV2tableByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainV2tableByAircraft(id);
        logger.info(`V2 table retrieved by aircraft id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getV2tableByAircraft with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getV2table: ${e}`);
    }
};

const getV2tables = async (_req: Request, res: Response) => {
    try {
        const response = await obtainV2tables();
        logger.info("All V2 tables retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getV2tables: ${e.stack || e}`);
        res.status(500).send(`Error getV2tables: ${e}`);
    }
};

const postV2table = async (req: Request, res: Response) => {
    try {
        const v2table = req.body;
        const response = await addV2table(v2table);
        logger.info(`V2 table created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postV2table with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postV2table: ${e}`);
    }
};

const updateV2table = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const v2table = req.body;
        const response = await putV2table(id, v2table);
        logger.info(`V2 table updated with id ${id}: ${JSON.stringify(v2table)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateV2table with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateV2table: ${e}`);
    }
};

const deleteV2table = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeV2table(id);
        logger.info(`V2 table deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteV2table with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteV2table: ${e}`);
    }
};

const addData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const v2tabledata = req.body;
        const response = await addV2tableRow(id, v2tabledata);
        logger.info(`Row added to V2 table ${id}: ${JSON.stringify(v2tabledata)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in addData for V2 table ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateV2table: ${e}`);
    }
};

const addRowData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const weight = req.params.weight;
        const v2tabledata = req.body;
        const response = await addV2tableRowData(id, parseFloat(weight), v2tabledata);
        logger.info(`Row data added to V2 table ${id} at weight ${weight}: ${JSON.stringify(v2tabledata)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in addRowData for V2 table ${req.params.id}, weight ${req.params.weight}: ${e.stack || e}`);
        res.status(500).json(`Error updateV2table: ${e}`);
    }
};

const getClosestRows = async (req: Request, res: Response) => {
    try {
        const { pressure, grossWeight, temperature, speedName, idAircraft } = req.body;
        const response = await obtainClosestRows(pressure, grossWeight, temperature, speedName, idAircraft);
        logger.info(`Closest V2 rows retrieved for aircraft ${idAircraft}, pressure ${pressure}, weight ${grossWeight}, temp ${temperature}, speed ${speedName}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getClosestRows with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error getClosestRows: ${e}`);
    }
};

export {
    getV2table,
    getV2tables,
    postV2table,
    updateV2table,
    deleteV2table,
    addData,
    getV2tableByAircraft,
    addRowData,
    getClosestRows
};
