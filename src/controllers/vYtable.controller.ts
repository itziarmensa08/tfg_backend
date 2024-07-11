import { Request, Response } from "express"
import { addVYtable, addVYtableRow, obtainClosestRows, obtainVYtable, obtainVYtableByAircraft, obtainVYtables, putVYtable, removeVYtable } from "../services/vYtable.service";

const getVYtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainVYtable(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getVYtable: ${e}`)
    }
}

const getVYtableByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const state = req.params.state;
        const response = await obtainVYtableByAircraft(id, state);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getVYtable: ${e}`)
    }
}

const getVYtables = async (req: Request, res: Response) => {
    try {
        const response = await obtainVYtables();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getVYtables: ${e}`)
    }
}

const postVYtable = async (req: Request, res: Response) => {
    try {
        const VYtable = req.body;
        const response = await addVYtable(VYtable);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postVYtable: ${e}`)
    }
}

const updateVYtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VYtable = req.body;
        const response = await putVYtable(id, VYtable);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateVYtable: ${e}`)
    }
}

const deleteVYtable = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeVYtable(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteVYtable: ${e}`)
    }
}

const addData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const VYtabledata = req.body;
        const response = await addVYtableRow(id, VYtabledata);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateVYtable: ${e}`)
    }
}

const getClosestRows = async (req: Request, res: Response) => {
    try {
        const pressure = req.body.pressure;
        const grossWeight = req.body.grossWeight;
        const idAircraft = req.body.idAircraft;
        const response = await obtainClosestRows(pressure, grossWeight, idAircraft);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getClosestRows: ${e}`)
    }
}

export {getVYtable, getVYtables, postVYtable, updateVYtable, deleteVYtable, addData, getVYtableByAircraft, getClosestRows};