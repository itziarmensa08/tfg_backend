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
    let densityValue;

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
        densityValue = closestAltitudeRows[0].density;
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
        const alt1 = closestAltitudeRows[0].altitudeFeet;
        const alt2 = closestAltitudeRows[1].altitudeFeet;
        const density1 = closestAltitudeRows[0].density;
        const density2 = closestAltitudeRows[1].density;
        densityValue = interpolateDensity(altitudeFeet, alt1, alt2, density1, density2);
    }

    const response = {
        "cells": closestAltitudeRows,
        "densityValue": densityValue
    }


    return response;
};

const interpolateDensity = (targetAltitudeFeet: number, alt1: number, alt2: number, density1: number, density2: number) => {
    const slope = (density2 - density1) / (alt2 - alt1);
    return density1 + slope * (targetAltitudeFeet - alt1);
};

export { obtainISAtables, obtainISAtable, addISAtable, putISAtable, removeISAtable, addISAtableData, obtainClosestISAtable };
