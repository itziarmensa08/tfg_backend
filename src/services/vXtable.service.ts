import { VXtable, VXtableRow, VXtableWeights } from "../interfaces/vXtable.interface";
import VXtableModel from "../models/vxtable.model";


const obtainVXtables = async () => {
    const response = await VXtableModel.find({});
    return response;
}

const obtainVXtable = async (id: string) => {
    const response = await VXtableModel.findOne({_id: id});
    return response;
}

const obtainVXtableByAircraft = async (idAircraft: string, state: String) => {
    const response = await VXtableModel.findOne({ aircraft: { $in: [idAircraft] }, state: state });
    return response;
}

const addVXtable = async (vYtable: VXtable) => {
    const response = await VXtableModel.create(vYtable);
    return response;
}

const putVXtable = async (id: string, VYtable: VXtable) => {
    const response = await VXtableModel.findOneAndUpdate({_id: id}, VYtable, {new: true});
    return response;
}

const removeVXtable = async (id: string) => {
    const response = await VXtableModel.findByIdAndDelete({_id: id});
    return response;
}

const addVXtableRow = async (VYtableId: string, VYtableData: VXtableRow) => {
    const VXtable = await VXtableModel.findById(VYtableId);
    if (!VXtable) {
        throw new Error("VXtable not found");
    }
    VXtable.rows.push(VYtableData);
    const updatedVYtable = await VXtableModel.findOneAndUpdate({_id: VYtableId}, VXtable, {new: true});
    return updatedVYtable;
};

const interpolate = (x: number, x1: number, x2: number, y1: number, y2: number): number => {
    return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
};

const obtainClosestRowsVX = async (pressure: number, grossWeight: number, idAircraft: string, state: string) => {
    const VXtable = await VXtableModel.findOne({ aircraft: { $in: [idAircraft] }, state: state });

    if (!VXtable) {
        throw new Error("VXtable not found for the specified aircraft");
    }

    const exactPressureRow = VXtable.rows.find(row => row.pressure === pressure);

    let closestPressureRows;
    if (exactPressureRow) {
        closestPressureRows = [exactPressureRow];
    } else {
        const sortedWeightRows = VXtable.rows.sort((a, b) => 
            Math.abs(a.pressure - pressure) - Math.abs(b.pressure - pressure)
        );
        closestPressureRows = sortedWeightRows.slice(0, 2);
    }

    let cells: VXtableWeights[] = [];

    for (let row of closestPressureRows) {
        const exactWeight = row.weights.find(p => p.weight === grossWeight);
        if (exactWeight) {
            cells.push(exactWeight);
        } else {
            const sortedWeights = row.weights.sort((a, b) => 
                Math.abs(a.weight - grossWeight) - Math.abs(b.weight - grossWeight)
            );
            cells.push(sortedWeights.slice(0, 2)[0]);
            cells.push(sortedWeights.slice(0, 2)[1]);
        }
    }

    // Interpolación
    if (cells.length === 4) {
        // Caso en el que tenemos dos pesos y dos altitudes para interpolar ambas dimensiones
        const pressure1 = closestPressureRows[0].pressure;
        const pressure2 = closestPressureRows[1].pressure;

        const weight1 = cells[0].weight;
        const weight2 = cells[1].weight;

        const velocityP1W1 = cells[0].velocityValue;
        const velocityP2W1 = cells[1].velocityValue;
        const velocityP1W2 = cells[2].velocityValue;
        const velocityP2W2 = cells[3].velocityValue;

        // Interpolamos primero por altitud en ambos pesos
        const interpolatedVelocityW1 = interpolate(pressure, pressure1, pressure2, velocityP1W1, velocityP2W1);
        const interpolatedVelocityW2 = interpolate(pressure, pressure1, pressure2, velocityP1W2, velocityP2W2);

        // Luego interpolamos por peso
        const finalVelocity = interpolate(grossWeight, weight1, weight2, interpolatedVelocityW1, interpolatedVelocityW2);

        return {
            cells: cells,
            finalVelocity: finalVelocity,
        };
    } else if (cells.length === 2) {
        // Caso en el que solo tenemos una fila de peso y dos valores de presión
        const weight1 = cells[0].weight;
        const weight2 = cells[1].weight;

        const velocityP1 = cells[0].velocityValue;
        const velocityP2 = cells[1].velocityValue;

        const finalVelocity = interpolate(pressure, weight1, weight2, velocityP1, velocityP2);

        return {
            cells: cells,
            finalVelocity: finalVelocity,
        };
    } else {
        // Si solo hay una celda (caso exacto), devolvemos su valor
        return {
            cells: cells,
            finalVelocity: cells[0].velocityValue,
        };
    }
};


export { obtainVXtables, obtainVXtable, addVXtable, putVXtable, removeVXtable, obtainVXtableByAircraft, addVXtableRow, obtainClosestRowsVX };