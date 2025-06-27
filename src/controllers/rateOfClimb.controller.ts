import { Request, Response } from "express";
import {
    addPressureLine,
    addRateOfClimbGraphic,
    addWeightLine,
    calculateRate,
    obtainRateOfClimbGraphic,
    obtainRateOfClimbGraphicByAircraft,
    obtainRateOfClimbGraphics,
    putRateOfClimbGraphic,
    removeRateOfClimbGraphic
} from "../services/rateOfClimb.service";
import logger from "../config/logger";

const getRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainRateOfClimbGraphic(id);
        logger.info(`Rate of climb graphic retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getRateOfClimbGraphic with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getRateOfClimbGraphic: ${e}`);
    }
};

const getRateOfClimbGraphicByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const segment = parseInt(req.params.segment, 10);
        const state = req.params.state;
        const response = await obtainRateOfClimbGraphicByAircraft(id, segment, state);
        logger.info(`Rate of climb graphic retrieved for aircraft ${id}, segment ${segment}, state ${state}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getRateOfClimbGraphicByAircraft with id ${req.params.id}, segment ${req.params.segment}, state ${req.params.state}: ${e.stack || e}`);
        res.status(500).json(`Error getRateOfClimbGraphicByAircraft: ${e}`);
    }
};

const getRateOfClimbGraphics = async (_req: Request, res: Response) => {
    try {
        const response = await obtainRateOfClimbGraphics();
        logger.info("All rate of climb graphics retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getRateOfClimbGraphics: ${e.stack || e}`);
        res.status(500).send(`Error getRateOfClimbGraphics: ${e}`);
    }
};

const postRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const rateOfClimbGraphic = req.body;
        const response = await addRateOfClimbGraphic(rateOfClimbGraphic);
        logger.info(`Rate of climb graphic created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postRateOfClimbGraphic with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postRateOfClimbGraphic: ${e}`);
    }
};

const updateRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const rateOfClimbGraphic = req.body;
        const response = await putRateOfClimbGraphic(id, rateOfClimbGraphic);
        logger.info(`Rate of climb graphic updated with id ${id}: ${JSON.stringify(rateOfClimbGraphic)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateRateOfClimbGraphic with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateRateOfClimbGraphic: ${e}`);
    }
};

const deleteRateOfClimbGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeRateOfClimbGraphic(id);
        logger.info(`Rate of climb graphic deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteRateOfClimbGraphic with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteRateOfClimbGraphic: ${e}`);
    }
};

const postPressureLine = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const pressureLine = req.body;
        const response = await addPressureLine(id, pressureLine);
        logger.info(`Pressure line added to rate of climb graphic id ${id}: ${JSON.stringify(pressureLine)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in postPressureLine for id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error postPressureLine: ${e}`);
    }
};

const postWeightLine = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const weightLine = req.body;
        const response = await addWeightLine(id, weightLine);
        logger.info(`Weight line added to rate of climb graphic id ${id}: ${JSON.stringify(weightLine)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in postWeightLine for id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error postWeightLine: ${e}`);
    }
};

const calculateRateOfClimb = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { temperature, altitud, weight } = req.body;
        const response = await calculateRate(id, temperature, altitud, weight);
        logger.info(`Rate of climb calculated for id ${id}, temperature ${temperature}, altitud ${altitud}, weight ${weight}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in calculateRateOfClimb for id ${req.params.id} with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error calculateRate: ${e}`);
    }
};

export {
    getRateOfClimbGraphic,
    getRateOfClimbGraphicByAircraft,
    getRateOfClimbGraphics,
    postRateOfClimbGraphic,
    updateRateOfClimbGraphic,
    deleteRateOfClimbGraphic,
    postPressureLine,
    postWeightLine,
    calculateRateOfClimb
};
