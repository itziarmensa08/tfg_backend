import {Schema, model} from "mongoose";
import { Aircraft } from "../interfaces/aircraft.interface";

const AircraftSchema = new Schema<Aircraft> (
    {
        name: {
            type: String,
            required: true,
        },
        metro: {
            type: String,
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

const AircraftModel = model('aircrafts', AircraftSchema);

export default AircraftModel;