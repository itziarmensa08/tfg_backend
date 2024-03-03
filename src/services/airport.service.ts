import { Airport } from "../interfaces/airport.interface";
import AirportModel from "../models/airport.model";



const obtainAirports = async () => {
    const response = await AirportModel.find({});
    return response;
}

const obtainAirport = async (id: string) => {
    const response = await AirportModel.findOne({_id: id});
    return response;
}

const addAirport = async (airport: Airport) => {
    const response = await AirportModel.create(airport);
    return response;
}

const putAirport = async (id: string, airport: Airport) => {
    const response = await AirportModel.findOneAndUpdate({_id: id}, airport, {new: true});
    return response;
}

const removeAirport = async (id: string) => {
    const response = await AirportModel.findByIdAndDelete({_id: id});
    return response;
}


export { obtainAirports, obtainAirport, addAirport, putAirport, removeAirport };