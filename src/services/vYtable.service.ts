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

const obtainClosestRows = async (pressure: number, grossWeight: number, idAircraft: string, state: String) => {
    const VYtable = await VYtableModel.findOne({ aircraft: { $in: [idAircraft] }, state: state });

    if (!VYtable) {
        throw new Error("VYtable not found for the specified aircraft");
    }

    const exactWeightRow = VYtable.rows.find(row => row.grossWeight === grossWeight);

    let closestWeightRows;
    if (exactWeightRow) {
        closestWeightRows = [exactWeightRow];
    } else {
        const sortedWeightRows = VYtable.rows.sort((a, b) => {
            return Math.abs(a.grossWeight - grossWeight) - Math.abs(b.grossWeight - grossWeight);
        });
        closestWeightRows = sortedWeightRows.slice(0, 2);
    }

    let cells: VYtablePressure[] = [];

    for (let row of closestWeightRows) {
        const exactPressure = row.pressures.find(p => p.pressureAltitude === pressure);
        if (exactPressure) {
            cells.push(exactPressure);
        } else {
            const sortedPressures = row.pressures.sort((a, b) => {
                return Math.abs(a.pressureAltitude - pressure) - Math.abs(b.pressureAltitude - pressure);
            });
            cells.push(sortedPressures.slice(0, 2)[0]);
            cells.push(sortedPressures.slice(0, 2)[1]);
        }
    }

    const velocityValues = cells.map(p => p.velocityValue);
    const median = calculateMedian(velocityValues);

    return {
        cells: cells,
        finalVelocity: median,
    };
};

// Función para calcular la mediana
const calculateMedian = (numbers: number[]) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        return sorted[middle];
    }
};


export { obtainVYtables, obtainVYtable, addVYtable, putVYtable, removeVYtable, obtainVYtableByAircraft, addVYtableRow, obtainClosestRows };