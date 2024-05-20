import {Schema, model} from "mongoose";
import { RateOfClimbGraphic } from "../interfaces/rateOfClimbGraphic.interface";

const AxisSchema = new Schema({
    x: { type: [Number], required: true },
    yWeight: { type: [Number], required: true },
    yAltitud: { type: [Number], required: true },
});

const CoordinateSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
});

const WeightLinesSchema = new Schema({
    points: { type: [CoordinateSchema], required: true },
});

const PressureLinesSchema = new Schema({
    altitud: { type: Schema.Types.Mixed, required: true },
    points: { type: [CoordinateSchema], required: true },
});

const ProcedureSchema = new Schema<RateOfClimbGraphic> (
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
        velocity: {
            type: String,
            required: true,
        },
        axis: { type: AxisSchema, required: true },
        pressureLines: { type: [PressureLinesSchema], required: true },
        weightLines: { type: [WeightLinesSchema], required: true },
        referenceLine: { type: [CoordinateSchema], required: true }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const RateOfClimbGrpahicModel = model('rateofclimbgraphics', ProcedureSchema);

export default RateOfClimbGrpahicModel;