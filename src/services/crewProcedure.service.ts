import { CrewProcedure } from "../interfaces/crewProcedure.interface";
import CrewProcedureModel from "../models/crewProcedure.model";

const obtainCrewProcedures = async () => {
    const response = await CrewProcedureModel.find({});
    return response;
}

const obtainCrewProcedure = async (id: string) => {
    const response = await CrewProcedureModel.findOne({ _id: id });
    return response;
}

const addCrewProcedure = async (crewProcedure: CrewProcedure) => {
    const response = await CrewProcedureModel.create(crewProcedure);
    return response;
}

const putCrewProcedure = async (id: string, crewProcedure: CrewProcedure) => {
    const response = await CrewProcedureModel.findOneAndUpdate(
        { _id: id },
        crewProcedure,
        { new: true }
    );
    return response;
}

const removeCrewProcedure = async (id: string) => {
    const response = await CrewProcedureModel.findByIdAndDelete({ _id: id });
    return response;
}

export { obtainCrewProcedures, obtainCrewProcedure, addCrewProcedure, putCrewProcedure, removeCrewProcedure };
