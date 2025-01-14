import { V2table, V2tableData, V2tableRow } from "../interfaces/v2table.interface";
import V2tableModel from "../models/v2table.model";



const obtainV2tables = async () => {
    const response = await V2tableModel.find({});
    return response;
}

const obtainV2table = async (id: string) => {
    const response = await V2tableModel.findOne({_id: id});
    return response;
}

const obtainV2tableByAircraft = async (idAircraft: string) => {
    const response = await V2tableModel.findOne({ aircraft: { $in: [idAircraft] } });
    return response;
}

const addV2table = async (v2table: V2table) => {
    const response = await V2tableModel.create(v2table);
    return response;
}

const putV2table = async (id: string, v2table: V2table) => {
    const response = await V2tableModel.findOneAndUpdate({_id: id}, v2table, {new: true});
    return response;
}

const removeV2table = async (id: string) => {
    const response = await V2tableModel.findByIdAndDelete({_id: id});
    return response;
}

const addV2tableRow = async (v2tableId: string, v2tableData: V2tableRow) => {
    const v2table = await V2tableModel.findById(v2tableId);
    if (!v2table) {
        throw new Error("V2table not found");
    }
    v2table.rows.push(v2tableData);
    const updatedV2table = await V2tableModel.findOneAndUpdate({_id: v2tableId}, v2table, {new: true});
    return updatedV2table;
};

const addV2tableRowData = async (v2tableId: string, weight: number, v2tableData: V2tableData) => {
    const v2table = await V2tableModel.findById(v2tableId);
    if (!v2table) {
        throw new Error("V2table not found");
    }
    const rowIndex = v2table.rows.findIndex(row => row.weight === weight);
    if (rowIndex === -1) {
        throw new Error("Row with specified weight not found");
    }
    v2table.rows[rowIndex].data.push(v2tableData);
    const updatedV2table = await V2tableModel.findOneAndUpdate({_id: v2tableId}, v2table, {new: true});
    return updatedV2table;
};

const obtainClosestRows = async (pressure: number, grossWeight: number, temperature: number, speedName: string, idAircraft: string) => {
    const v2table = await V2tableModel.findOne({ aircraft: idAircraft });

    if (!v2table) {
        throw new Error("V2table not found for the specified aircraft");
    }

    let closestPressureRows;

    const exactPressureRows = await V2tableModel.aggregate([
        {
            $match: {
                _id: v2table._id,
                "rows.pressure": pressure
            }
        },
        {
            $unwind: "$rows"
        },
        {
            $match: { "rows.pressure": pressure }
        },
        {
            $replaceRoot: { newRoot: "$rows" }
        }
    ]);

    if (exactPressureRows.length > 0) {
        closestPressureRows = exactPressureRows;
    } else {
        const lowerBound = Math.floor(pressure / 1000) * 1000;
        const upperBound = lowerBound + 1000;

        closestPressureRows = await V2tableModel.aggregate([
            {
                $match: { _id: v2table._id }
            },
            {
                $unwind: "$rows"
            },
            {
                $match: {
                    $or: [
                        { "rows.pressure": { $eq: lowerBound } },
                        { "rows.pressure": { $eq: upperBound } }
                    ]
                }
            },
            {
                $replaceRoot: { newRoot: "$rows" }
            }
        ]);
    }

    let closestWeightRows;

    const exactWeightRows = closestPressureRows.filter((row: V2tableRow) => row.weight === grossWeight);

    if (exactWeightRows.length > 0) {
        closestWeightRows = exactWeightRows;
    } else {
        const lowerWeight = Math.floor(grossWeight / 500) * 500;
        const higherWeight = Math.ceil(grossWeight / 500) * 500;

        closestWeightRows = closestPressureRows.filter((row: V2tableRow) => row.weight === lowerWeight || row.weight === higherWeight);
    }

    let closestTemperatureData = [];

    const exactTemperatureData = closestWeightRows.reduce((accumulator: V2tableData[], row: V2tableRow) => {
        const rowData = row.data.filter((data: V2tableData) => data.temperature === temperature);
        if (rowData.length > 0) {
            accumulator.push(...rowData);
        }
        return accumulator;
    }, []);

    if (exactTemperatureData.length > 0) {
        closestTemperatureData = exactTemperatureData;
    } else {
        const predefinedTemperatures = v2table.temperatures;
        const [closest1, closest2] = findClosestNumbers(predefinedTemperatures, temperature);
        closestTemperatureData = closestWeightRows.reduce((accumulator: V2tableData[], row: V2tableRow) => {
            const closestTemperatures = row.data.filter((data: V2tableData) => data.temperature === closest1 || data.temperature === closest2);
            accumulator.push(...closestTemperatures);
            return accumulator;
        }, []);
    }

    const filteredData = closestTemperatureData.filter((data: V2tableData) => {
        return data.velocityName === speedName;
    });

    const velocityValues = filteredData.map((data: V2tableData) => data.velocityValue);
    const median = calculateMedian(velocityValues);
    const response = {
        "cells": filteredData,
        "finalVelocity": median
    }

    return response;
};

function findClosestNumbers(list: number[], x: number): [number, number] {
    list.sort((a, b) => a - b);

    let closest1 = Number.NEGATIVE_INFINITY;
    let closest2 = Number.POSITIVE_INFINITY;

    for (let num of list) {
        if (num <= x && num > closest1) {
            closest1 = num;
        }
        if (num >= x && num < closest2) {
            closest2 = num;
        }
    }

    return [closest1, closest2];
}

function calculateMedian(velocityValues: number[]): number {
    velocityValues.sort((a, b) => a - b);

    const n = velocityValues.length;
    if (n % 2 !== 0) {
        return velocityValues[Math.floor(n / 2)];
    }
    const midIndex = n / 2;
    return (velocityValues[midIndex - 1] + velocityValues[midIndex]) / 2;
}


export { obtainV2tables, obtainV2table, addV2table, putV2table, removeV2table, addV2tableRowData, obtainV2tableByAircraft, addV2tableRow, obtainClosestRows };