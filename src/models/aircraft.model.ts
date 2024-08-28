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
        profile: {
            nMotors: {
                heightFirstSegment: {
                    type: Number,
                },
                heightSecondSegment: {
                    type: Number,
                }
            },
            failure: {
                heightFirstSegment: {
                    type: Number,
                },
                heightSecondSegment: {
                    type: Number,
                }
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const AircraftModel = model('aircrafts', AircraftSchema);

export default AircraftModel;