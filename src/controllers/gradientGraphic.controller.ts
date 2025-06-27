import { Request, Response } from "express";
import {
    addGradientGraphic,
    addGradientLine,
    calculateDistance,
    obtainGradientGraphic,
    obtainGradientGraphicByAircraft,
    obtainGradientGraphics,
    putGradientGraphic,
    removeGradientGraphic
} from "../services/gradientGraphic.service";
import logger from "../config/logger";

const getGradientGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainGradientGraphic(id);
        logger.info(`Gradient graphic retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getGradientGraphic with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getGradientGraphic: ${e}`);
    }
};

const getGradientGraphicByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const segment = parseInt(req.params.segment, 10);
        const response = await obtainGradientGraphicByAircraft(id, segment);
        logger.info(`Gradient graphic by aircraft retrieved for aircraft id ${id}, segment ${segment}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getGradientGraphicByAircraft with id ${req.params.id} and segment ${req.params.segment}: ${e.stack || e}`);
        res.status(500).json(`Error getGradientGraphicByAircraft: ${e}`);
    }
};

const getGradientGraphics = async (_req: Request, res: Response) => {
    try {
        const response = await obtainGradientGraphics();
        logger.info("All gradient graphics retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getGradientGraphics: ${e.stack || e}`);
        res.status(500).send(`Error getGradientGraphics: ${e}`);
    }
};

const postGradientGraphic = async (req: Request, res: Response) => {
    try {
        const GradientGraphic = req.body;
        const response = await addGradientGraphic(GradientGraphic);
        logger.info(`Gradient graphic created: ${JSON.stringify(response)}`);
        res.status(201).send(response);
    } catch (e: any) {
        logger.error(`Error in postGradientGraphic with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postGradientGraphic: ${e}`);
    }
};

const updateGradientGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const GradientGraphic = req.body;
        const response = await putGradientGraphic(id, GradientGraphic);
        logger.info(`Gradient graphic updated with id ${id}: ${JSON.stringify(GradientGraphic)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateGradientGraphic with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateGradientGraphic: ${e}`);
    }
};

const deleteGradientGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeGradientGraphic(id);
        logger.info(`Gradient graphic deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteGradientGraphic with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteGradientGraphic: ${e}`);
    }
};

const postGradientLine = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const gradientLine = req.body;
        const response = await addGradientLine(id, gradientLine);
        logger.info(`Gradient line added to graphic id ${id}: ${JSON.stringify(gradientLine)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in postGradientLine for id ${req.params.id} with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postGradientLine: ${e}`);
    }
};

const calculateGradient = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { gradient, altitud } = req.body;
        const response = await calculateDistance(id, gradient, altitud);
        logger.info(`Gradient distance calculated for id ${id}, gradient ${gradient}, altitud ${altitud}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in calculateGradient for id ${req.params.id} with body ${JSON.stringify(req.body)}: ${e.stack || e}`);
        res.status(500).json(`Error postWeightLine: ${e}`);
    }
};

export {
    getGradientGraphic,
    getGradientGraphicByAircraft,
    getGradientGraphics,
    postGradientGraphic,
    updateGradientGraphic,
    deleteGradientGraphic,
    postGradientLine,
    calculateGradient
};
