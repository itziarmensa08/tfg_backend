import { ISAtable, ISAtableData, Pressure } from "../interfaces/ISAtable.interface";
import ISAtableModel from "../models/ISAtable.model";


const obtainISAtables = async () => {
    const response = await ISAtableModel.find({});
    return response;
}

const obtainISAtable = async (id: string) => {
    const response = await ISAtableModel.findById(id);
    return response;
}

const addISAtable = async (isatable: ISAtable) => {
    const response = await ISAtableModel.create(isatable);
    return response;
}

const putISAtable = async (id: string, isatable: ISAtable) => {
    const response = await ISAtableModel.findByIdAndUpdate(id, isatable, { new: true });
    return response;
}

const removeISAtable = async (id: string) => {
    const response = await ISAtableModel.findByIdAndDelete(id);
    return response;
}

const addISAtableData = async (isatableId: string, isatableData: ISAtableData) => {
    const response = await ISAtableModel.findByIdAndUpdate(isatableId, { $push: { data: isatableData } }, { new: true });
    return response;
};

const obtainClosestISAtable = async (altitudeFeet: number, pressure: Pressure) => {
    const response = await ISAtableModel.findOne({
        "data.altitudeFeet": { $lte: altitudeFeet },
        "data.pressure": { $gte: pressure.hPa }
    }).sort({ "data.altitudeFeet": -1, "data.pressure": 1 });
    return response;
};

export { obtainISAtables, obtainISAtable, addISAtable, putISAtable, removeISAtable, addISAtableData, obtainClosestISAtable };
