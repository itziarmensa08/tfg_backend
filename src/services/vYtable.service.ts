import { V2tableData } from "../interfaces/v2table.interface";
import { VYtable, VYtablePressure, VYtableRow } from "../interfaces/vYtable.interface";
import VYtableModel from "../models/vYtable.model";

const obtainVYtables = async () => {
    const response = await VYtableModel.find({});
    return response;
}

const obtainVYtable = async (id: string) => {
    const response = await VYtableModel.findOne({_id: id});
    return response;
}

const obtainVYtableByAircraft = async (idAircraft: string, state: String) => {
    const response = await VYtableModel.findOne({ aircraft: { $in: [idAircraft] }, state: state });
    return response;
}

const addVYtable = async (vYtable: VYtable) => {
    const response = await VYtableModel.create(vYtable);
    return response;
}

const putVYtable = async (id: string, VYtable: VYtable) => {
    const response = await VYtableModel.findOneAndUpdate({_id: id}, VYtable, {new: true});
    return response;
}

const removeVYtable = async (id: string) => {
    const response = await VYtableModel.findByIdAndDelete({_id: id});
    return response;
}

const addVYtableRow = async (VYtableId: string, VYtableData: VYtableRow) => {
    const VYtable = await VYtableModel.findById(VYtableId);
    if (!VYtable) {
        throw new Error("VYtable not found");
    }
    VYtable.rows.push(VYtableData);
    const updatedVYtable = await VYtableModel.findOneAndUpdate({_id: VYtableId}, VYtable, {new: true});
    return updatedVYtable;
};

const interpolate = (x: number, x1: number, x2: number, y1: number, y2: number): number => {
    return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
};

const obtainClosestRows = async (pressure: number, grossWeight: number, idAircraft: string, state: string) => {
    const VYtable = await VYtableModel.findOne({ aircraft: { $in: [idAircraft] }, state: state });

    if (!VYtable) {
        throw new Error("VYtable not found for the specified aircraft");
    }

    const exactWeightRow = VYtable.rows.find(row => row.grossWeight === grossWeight);

    let closestWeightRows;
    if (exactWeightRow) {
        closestWeightRows = [exactWeightRow];
    } else {
        const sortedWeightRows = VYtable.rows.sort((a, b) => 
            Math.abs(a.grossWeight - grossWeight) - Math.abs(b.grossWeight - grossWeight)
        );
        closestWeightRows = sortedWeightRows.slice(0, 2);
    }

    let cells: VYtablePressure[] = [];

    for (let row of closestWeightRows) {
        const exactPressure = row.pressures.find(p => p.pressureAltitude === pressure);
        if (exactPressure) {
            cells.push(exactPressure);
        } else {
            const sortedPressures = row.pressures.sort((a, b) => 
                Math.abs(a.pressureAltitude - pressure) - Math.abs(b.pressureAltitude - pressure)
            );
            cells.push(sortedPressures.slice(0, 2)[0]);
            cells.push(sortedPressures.slice(0, 2)[1]);
        }
    }

    // Interpolación
    if (cells.length === 4) {
        // Caso en el que tenemos dos pesos y dos altitudes para interpolar ambas dimensiones
        const weight1 = closestWeightRows[0].grossWeight;
        const weight2 = closestWeightRows[1].grossWeight;

        const pressure1 = cells[0].pressureAltitude;
        const pressure2 = cells[1].pressureAltitude;

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
        const pressure1 = cells[0].pressureAltitude;
        const pressure2 = cells[1].pressureAltitude;

        const velocityP1 = cells[0].velocityValue;
        const velocityP2 = cells[1].velocityValue;

        const finalVelocity = interpolate(pressure, pressure1, pressure2, velocityP1, velocityP2);

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


export { obtainVYtables, obtainVYtable, addVYtable, putVYtable, removeVYtable, obtainVYtableByAircraft, addVYtableRow, obtainClosestRows };