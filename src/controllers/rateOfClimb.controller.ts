import { Request, Response } from "express"
import { addPressureLine, addRateOfClimbGraphic, addWeightLine, calculateRate, obtainRateOfClimbGraphic, obtainRateOfClimbGraphicByAircraft, obtainRateOfClimbGraphics, putRateOfClimbGraphic, removeRateOfClimbGraphic } from "../services/rateOfClimb.service";


const getRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainRateOfClimbGraphic(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getRateOfClimbGraphic: ${e}`)
    }
}

const getRateOfClimbGraphicByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainRateOfClimbGraphicByAircraft(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getRateOfClimbGraphicByAircraft: ${e}`)
    }
}

const getRateOfClimbGraphics = async (req: Request, res: Response) => {
    try {
        const response = await obtainRateOfClimbGraphics();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getRateOfClimbGraphics: ${e}`)
    }
}

const postRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const rateOfClimbGraphic = req.body;
        const response = await addRateOfClimbGraphic(rateOfClimbGraphic);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postRateOfClimbGraphic: ${e}`)
    }
}

const updateRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const rateOfClimbGraphic = req.body;
        const response = await putRateOfClimbGraphic(id, rateOfClimbGraphic);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateRateOfClimbGraphic: ${e}`)
    }
}

const deleteRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeRateOfClimbGraphic(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteRateOfClimbGraphic: ${e}`)
    }
}

const postPressureLine = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const pressureLine = req.body;
        const response = await addPressureLine(id, pressureLine);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error postPressureLine: ${e}`)
    }
}

const postWeightLine = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const weightLine = req.body;
        const response = await addWeightLine(id, weightLine);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error postWeightLine: ${e}`)
    }
}

const calculateRateOfClimb = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const temperature = req.body.temperature;
        const altitud = req.body.altitud;
        const weight = req.body.weight;
        const response = await calculateRate(id, temperature, altitud, weight);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error postWeightLine: ${e}`)
    }
}

export {getRateOfClimbGraphic, getRateOfClimbGraphicByAircraft, getRateOfClimbGraphics, postRateOfClimbGraphic, updateRateOfClimbGraphic, deleteRateOfClimbGraphic, postPressureLine, postWeightLine, calculateRateOfClimb };