import { PressureLine, RateOfClimbGraphic, WeightLines } from "../interfaces/rateOfClimbGraphic.interface";
import RateOfClimbGrpahicModel from "../models/rateOfClimb.model";


const obtainRateOfClimbGraphics = async () => {
    const response = await RateOfClimbGrpahicModel.find({});
    return response;
}

const obtainRateOfClimbGraphic = async (id: string) => {
    const response = await RateOfClimbGrpahicModel.findOne({_id: id});
    return response;
}

const obtainRateOfClimbGraphicByAircraft = async (idAircraft: string) => {
    const response = await RateOfClimbGrpahicModel.findOne({ aircraft: { $in: [idAircraft] } });
    return response;
}

const addRateOfClimbGraphic = async (rateOfClimbGraphic: RateOfClimbGraphic) => {
    const response = await RateOfClimbGrpahicModel.create(rateOfClimbGraphic);
    return response;
}

const putRateOfClimbGraphic = async (id: string, rateOfClimbGraphic: RateOfClimbGraphic) => {
    const response = await RateOfClimbGrpahicModel.findOneAndUpdate({_id: id}, rateOfClimbGraphic, {new: true});
    return response;
}

const removeRateOfClimbGraphic = async (id: string) => {
    const response = await RateOfClimbGrpahicModel.findByIdAndDelete({_id: id});
    return response;
}

const addPressureLine = async (graphicId: string, pressureLine: PressureLine) => {
    const graphic = await RateOfClimbGrpahicModel.findById(graphicId);
    if (!graphic) {
        throw new Error("Graphic not found");
    }
    graphic.pressureLines.push(pressureLine);
    const updatedGraphic = await RateOfClimbGrpahicModel.findOneAndUpdate({_id: graphicId}, graphic, {new: true});
    return updatedGraphic;
};

const addWeightLine = async (graphicId: string, weightLine: WeightLines) => {
    const graphic = await RateOfClimbGrpahicModel.findById(graphicId);
    if (!graphic) {
        throw new Error("Graphic not found");
    }
    graphic.weightLines.push(weightLine);
    const updatedGraphic = await RateOfClimbGrpahicModel.findOneAndUpdate({_id: graphicId}, graphic, {new: true});
    return updatedGraphic;
};

export { obtainRateOfClimbGraphics, obtainRateOfClimbGraphic, obtainRateOfClimbGraphicByAircraft, addRateOfClimbGraphic, putRateOfClimbGraphic, removeRateOfClimbGraphic, addPressureLine, addWeightLine };