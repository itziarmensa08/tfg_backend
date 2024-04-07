import {Schema, model} from "mongoose";
import { ISAtable } from "../interfaces/ISAtable.interface";

const ISAtableSchema = new Schema<ISAtable>({
    title: {
        type: String,
        required: true
    },
    data: [{
        altitudeFeet: {
            type: Number,
            required: true
        },
        temperature: {
            type: Number,
            required: true
        },
        pressure: {
            hPa: {
                type: Number,
                required: true
            },
            PSI: {
                type: Number,
                required: true
            },
            InHg: {
                type: Number,
                required: true
            }
        },
        pressureRatio: {
            type: Number,
            required: true
        },
        density: {
            type: Number,
            required: true
        },
        speedSound: {
            type: Number,
            required: true
        },
        altitudeMeters: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

const ISAtableModel = model('ISAtables', ISAtableSchema);

export default ISAtableModel;