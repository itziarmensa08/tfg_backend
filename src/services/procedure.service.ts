import { Procedure } from "../interfaces/procedure.interface";
import ProcedureModel from "../models/procedure.model";


const obtainProcedures = async () => {
    const response = await ProcedureModel.find({});
    return response;
}

const obtainProcedure = async (id: string) => {
    const response = await ProcedureModel.findOne({_id: id});
    return response;
}

const addProcedure = async (procedure: Procedure) => {
    const response = await ProcedureModel.create(procedure);
    return response;
}

const putProcedure = async (id: string, procedure: Procedure) => {
    const response = await ProcedureModel.findOneAndUpdate({_id: id}, procedure, {new: true});
    return response;
}

const removeProcedure = async (id: string) => {
    const response = await ProcedureModel.findByIdAndDelete({_id: id});
    return response;
}


export { obtainProcedures, obtainProcedure, addProcedure, putProcedure, removeProcedure };