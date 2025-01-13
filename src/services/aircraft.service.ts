import { Aircraft } from "../interfaces/aircraft.interface";
import AircraftModel from "../models/aircraft.model";


const obtainAircrafts = async () => {
    const response = await AircraftModel.find({});
    return response;
}

const obtainAircraft = async (id: string) => {
    const response = await AircraftModel.findOne({_id: id});
    return response;
}

const addAircraft = async (aircraft: Aircraft) => {
    aircraft.visible = true;
    const response = await AircraftModel.create(aircraft);
    return response;
}

const putAircraft = async (id: string, aircraft: Aircraft) => {
    const response = await AircraftModel.findOneAndUpdate({_id: id}, aircraft, {new: true});
    return response;
}

const removeAircraft = async (id: string) => {
    const response = await AircraftModel.findByIdAndDelete({_id: id});
    return response;
}


export { obtainAircrafts, obtainAircraft, putAircraft, removeAircraft, addAircraft };