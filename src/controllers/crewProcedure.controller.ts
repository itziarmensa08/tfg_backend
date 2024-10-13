import { Request, Response } from "express";
import {
    addCrewProcedure,
    obtainCrewProcedure,
    obtainCrewProcedures,
    putCrewProcedure,
    removeCrewProcedure
} from "../services/crewProcedure.service";

const getCrewProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainCrewProcedure(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getCrewProcedure: ${e}`);
    }
}

const getCrewProcedures = async (req: Request, res: Response) => {
    try {
        const response = await obtainCrewProcedures();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getCrewProcedures: ${e}`);
    }
}

const postCrewProcedure = async (req: Request, res: Response) => {
    try {
        const crewProcedure = req.body;
        const response = await addCrewProcedure(crewProcedure);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postCrewProcedure: ${e}`);
    }
}

const updateCrewProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const crewProcedure = req.body;
        const response = await putCrewProcedure(id, crewProcedure);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateCrewProcedure: ${e}`);
    }
}

const deleteCrewProcedure = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeCrewProcedure(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteCrewProcedure: ${e}`);
    }
}

export {
    getCrewProcedure,
    getCrewProcedures,
    postCrewProcedure,
    updateCrewProcedure,
    deleteCrewProcedure
};
