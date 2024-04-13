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

const obtainClosestISAtable = async (altitudeFeet: number) => {
    const isatable = await ISAtableModel.find({});

    if (!isatable[0]) {
        throw new Error("ISAtable not found");
    }

    let closestAltitudeRows;

    const exactAltitudeRows = await ISAtableModel.aggregate([
        {
            $match: {
                _id: isatable[0]._id,
                "data.altitudeFeet": altitudeFeet
            }
        },
        {
            $unwind: "$data"
        },
        {
            $match: { "data.altitudeFeet": altitudeFeet }
        },
        {
            $replaceRoot: { newRoot: "$data" }
        }
    ]);

    if (exactAltitudeRows.length > 0) {
        closestAltitudeRows = exactAltitudeRows;
    } else {
        closestAltitudeRows = await ISAtableModel.aggregate([
            {
                $match: { _id: isatable[0]._id }
            },
            {
                $unwind: "$data"
            },
            {
                $addFields: {
                    altitudeDifference: { $abs: { $subtract: ["$data.altitudeFeet", altitudeFeet] } }
                }
            },
            {
                $sort: { altitudeDifference: 1 }
            },
            {
                $limit: 2
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ]);
    }

    return closestAltitudeRows;
};

export { obtainISAtables, obtainISAtable, addISAtable, putISAtable, removeISAtable, addISAtableData, obtainClosestISAtable };
