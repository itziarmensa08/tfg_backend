import { V2table, V2tableData } from "../interfaces/v2table.interface";
import V2tableModel from "../models/v2table.model";



const obtainV2tables = async () => {
    const response = await V2tableModel.find({});
    return response;
}

const obtainV2table = async (id: string) => {
    const response = await V2tableModel.findOne({_id: id});
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

const addV2tableData = async (v2tableId: string, v2tableData: V2tableData) => {
    const v2table = await V2tableModel.findById(v2tableId);
    if (!v2table) {
        throw new Error("V2table not found");
    }
    v2table.data.push(v2tableData);
    const updatedV2table = await V2tableModel.findOneAndUpdate({_id: v2tableId}, v2table, {new: true});
    return updatedV2table;
};


export { obtainV2tables, obtainV2table, addV2table, putV2table, removeV2table, addV2tableData };