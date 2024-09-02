import { Procedure } from "../interfaces/procedure.interface";
import AirportModel from "../models/airport.model";
import ProcedureModel from "../models/procedure.model";


const obtainProcedures = async () => {
    const response = await ProcedureModel.find({}).populate(['aircraft', 'airport']);
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

const obtainAirportsWithProcedures = async () => {
    const procedureAggregation = await ProcedureModel.aggregate([
        {
            $group: {
                _id: '$airport',
            },
        },
    ]);

    const airportIds = procedureAggregation.map((doc) => doc._id);

    const airports = await AirportModel.find({ _id: { $in: airportIds } });

    return airports;
}


export { obtainProcedures, obtainProcedure, addProcedure, putProcedure, removeProcedure, obtainAirportsWithProcedures };