import {Schema, model} from "mongoose";
import { V2table } from "../interfaces/v2table.interface";

const V2tableSchema = new Schema<V2table> (
    {
        aircraft: {
            type: [Schema.Types.ObjectId],
            ref: 'aircrafts',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        temperatures: [{
            type: Number,
            required: true
        }],
        rows: [{
            pressure: {
                type: Number,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            data: [{
                temperature: {
                    type: Number,
                    required: true
                },
                velocityName: {
                    type: String,
                    required: true
                },
                velocityValue: {
                    type: Number,
                    required: true
                }
            }]
        }]
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const V2tableModel = model('v2tables', V2tableSchema);

export default V2tableModel;