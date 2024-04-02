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


export { obtainV2tables, obtainV2table, addV2table, putV2table, removeV2table, addV2tableRowData, obtainV2tableByAircraft, addV2tableRow };