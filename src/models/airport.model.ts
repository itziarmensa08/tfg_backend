import {Schema, model} from "mongoose";
import { Airport } from "../interfaces/airport.interface";

const AirportSchema = new Schema<Airport> (
    {
        name: {
            type: String,
            required: true,
        },
        elevation: {
            type: Number,
            required: true,
        },
        oaciCode: {
            type: String,
            required: true,
        },
        iataCode: {
            type: String,
            required: true,
        },
        referenceTemperature: {
            type: Number,
            required: true,
        },
        profileImage: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const AirportModel = model('airports', AirportSchema);

export default AirportModel;