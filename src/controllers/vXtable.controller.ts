import { Request, Response } from "express"
import { addVXtable, addVXtableRow, obtainClosestRowsVX, obtainVXtable, obtainVXtableByAircraft, obtainVXtables, putVXtable, removeVXtable } from "../services/vXtable.service";

const getVXtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainVXtable(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getVXtable: ${e}`)
    }
}

const getVXtableByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const state = req.params.state;
        const response = await obtainVXtableByAircraft(id, state);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getVXtable: ${e}`)
    }
}

const getVXtables = async (req: Request, res: Response) => {
    try {
        const response = await obtainVXtables();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getVXtables: ${e}`)
    }
}

const postVXtable = async (req: Request, res: Response) => {
    try {
        const VXtable = req.body;
        const response = await addVXtable(VXtable);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postVXtable: ${e}`)
    }
}

const updateVXtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VXtable = req.body;
        const response = await putVXtable(id, VXtable);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateVXtable: ${e}`)
    }
}

const deleteVXtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeVXtable(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteVXtable: ${e}`)
    }
}

const addData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VXtabledata = req.body;
        const response = await addVXtableRow(id, VXtabledata);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateVXtable: ${e}`)
    }
}

const getClosestRows = async (req: Request, res: Response) => {
    try {
        const pressure = req.body.pressure;
        const grossWeight = req.body.grossWeight;
        const idAircraft = req.body.idAircraft;
        const state = req.body.state;
        const response = await obtainClosestRowsVX(pressure, grossWeight, idAircraft, state);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getClosestRowsVX: ${e}`)
    }
}

export {getVXtable, getVXtables, postVXtable, updateVXtable, deleteVXtable, addData, getVXtableByAircraft, getClosestRows};