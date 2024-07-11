import { Request, Response } from "express"
import { addGradientGraphic, addGradientLine, calculateDistance, obtainGradientGraphic, obtainGradientGraphicByAircraft, obtainGradientGraphics, putGradientGraphic, removeGradientGraphic } from "../services/gradientGraphic.service";


const getGradientGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainGradientGraphic(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getGradientGraphic: ${e}`)
    }
}

const getGradientGraphicByAircraft = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const segment = parseInt(req.params.segment, 10);
        const response = await obtainGradientGraphicByAircraft(id, segment);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getGradientGraphicByAircraft: ${e}`)
    }
}

const getGradientGraphics = async (req: Request, res: Response) => {
    try {
        const response = await obtainGradientGraphics();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getGradientGraphics: ${e}`)
    }
}

const postGradientGraphic = async (req: Request, res: Response) => {
    try {
        const GradientGraphic = req.body;
        const response = await addGradientGraphic(GradientGraphic);
        res.status(201).send(response);
    } catch (e) {
        res.status(500).json(`Error postGradientGraphic: ${e}`)
    }
}

const updateGradientGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const GradientGraphic = req.body;
        const response = await putGradientGraphic(id, GradientGraphic);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateGradientGraphic: ${e}`)
    }
}

const deleteGradientGraphic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeGradientGraphic(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteGradientGraphic: ${e}`)
    }
}

const postGradientLine = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const gradientLine = req.body;
        const response = await addGradientLine(id, gradientLine);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error postGradientLine: ${e}`)
    }
}

const calculateGradient = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const gradient = req.body.gradient;
        const altitud = req.body.altitud;
        const response = await calculateDistance(id, gradient, altitud);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error postWeightLine: ${e}`)
    }
}

export {getGradientGraphic, getGradientGraphicByAircraft, getGradientGraphics, postGradientGraphic, updateGradientGraphic, deleteGradientGraphic, postGradientLine, calculateGradient };