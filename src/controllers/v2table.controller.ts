import { Request, Response } from "express"
import { addV2table, addV2tableData, obtainV2table, obtainV2tables, putV2table, removeV2table } from "../services/v2table.service";

const getV2table = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainV2table(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getV2table: ${e}`)
    }
}

const getV2tables = async (req: Request, res: Response) => {
    try {
        const response = await obtainV2tables();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getV2tables: ${e}`)
    }
}

const postV2table = async (req: Request, res: Response) => {
    try {
        const v2table = req.body;
        const response = await addV2table(v2table);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postV2table: ${e}`)
    }
}

const updateV2table = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const v2table = req.body;
        const response = await putV2table(id, v2table);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateV2table: ${e}`)
    }
}

const deleteV2table = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeV2table(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteV2table: ${e}`)
    }
}

const addData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const v2tabledata = req.body;
        const response = await addV2tableData(id, v2tabledata);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateV2table: ${e}`)
    }
}

export {getV2table, getV2tables, postV2table, updateV2table, deleteV2table, addData};