import { Request, Response } from "express"
import { addProcedure, obtainAircraftsByAirport, obtainAirportsWithProcedures, obtainProcedure, obtainProcedures, obtainProceduresByAirportAndAircraft, putProcedure, removeProcedure } from "../services/procedure.service";

const getProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainProcedure(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getProcedure: ${e}`)
    }
}

const getProcedures = async (req: Request, res: Response) => {
    try {
        const response = await obtainProcedures();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getProcedures: ${e}`)
    }
}

const postProcedure = async (req: Request, res: Response) => {
    try {
        const procedure = req.body;
        const response = await addProcedure(procedure);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postProcedure: ${e}`)
    }
}

const updateProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const procedure = req.body;
        const response = await putProcedure(id, procedure);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateProcedure: ${e}`)
    }
}

const deleteProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeProcedure(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteProcedure: ${e}`)
    }
}

const getAirportsWithProcedures = async (req: Request, res: Response) => {
    try {
        const response = await obtainAirportsWithProcedures();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getting airports: ${e}`)
    }
}

const getAircraftsByAirport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainAircraftsByAirport(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getting aircrafts: ${e}`)
    }
}

const getProceduresByAirportAndAircraft = async (req: Request, res: Response) => {
    try {
        const idAirport = req.params.idAirport;
        const idAircraft = req.params.idAircraft;
        const response = await obtainProceduresByAirportAndAircraft(idAirport, idAircraft);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getting procedures: ${e}`)
    }
}

export {getProcedure, getProcedures, postProcedure, updateProcedure, deleteProcedure, getAirportsWithProcedures, getAircraftsByAirport, getProceduresByAirportAndAircraft};