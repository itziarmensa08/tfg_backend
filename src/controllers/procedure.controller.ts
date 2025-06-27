import { Request, Response } from "express";
import {
    addProcedure,
    obtainAircraftsByAirport,
    obtainAirportsWithProcedures,
    obtainProcedure,
    obtainProcedures,
    obtainProceduresByAirportAndAircraft,
    putProcedure,
    removeProcedure
} from "../services/procedure.service";
import logger from "../config/logger";

const getProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainProcedure(id);
        logger.info(`Procedure retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getProcedure with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getProcedure: ${e}`);
    }
};

const getProcedures = async (_req: Request, res: Response) => {
    try {
        const response = await obtainProcedures();
        logger.info("All procedures retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getProcedures: ${e.stack || e}`);
        res.status(500).send(`Error getProcedures: ${e}`);
    }
};

const postProcedure = async (req: Request, res: Response) => {
    try {
        const procedure = req.body;
        const response = await addProcedure(procedure);
        logger.info(`Procedure created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postProcedure with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postProcedure: ${e}`);
    }
};

const updateProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const procedure = req.body;
        const response = await putProcedure(id, procedure);
        logger.info(`Procedure updated with id ${id}: ${JSON.stringify(procedure)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateProcedure with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateProcedure: ${e}`);
    }
};

const deleteProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeProcedure(id);
        logger.info(`Procedure deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteProcedure with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteProcedure: ${e}`);
    }
};

const getAirportsWithProcedures = async (_req: Request, res: Response) => {
    try {
        const response = await obtainAirportsWithProcedures();
        logger.info("Airports with procedures retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getAirportsWithProcedures: ${e.stack || e}`);
        res.status(500).json(`Error getting airports: ${e}`);
    }
};

const getAircraftsByAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainAircraftsByAirport(id);
        logger.info(`Aircrafts retrieved for airport id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getAircraftsByAirport with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getting aircrafts: ${e}`);
    }
};

const getProceduresByAirportAndAircraft = async (req: Request, res: Response) => {
    try {
        const idAirport = req.params.idAirport;
        const idAircraft = req.params.idAircraft;
        const response = await obtainProceduresByAirportAndAircraft(idAirport, idAircraft);
        logger.info(`Procedures retrieved for airport id ${idAirport} and aircraft id ${idAircraft}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getProceduresByAirportAndAircraft with airport ${req.params.idAirport} and aircraft ${req.params.idAircraft}: ${e.stack || e}`);
        res.status(500).json(`Error getting procedures: ${e}`);
    }
};

export {
    getProcedure,
    getProcedures,
    postProcedure,
    updateProcedure,
    deleteProcedure,
    getAirportsWithProcedures,
    getAircraftsByAirport,
    getProceduresByAirportAndAircraft
};
