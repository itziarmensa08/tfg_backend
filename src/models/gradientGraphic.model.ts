import {Schema, model} from "mongoose";
import { GradientGraphic } from "../interfaces/gradientGraphic.interface";

const AxisSchema = new Schema({
    x: { type: [Number], required: true },
    y: { type: [Number], required: true },
});

const CoordinateSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
});

const GradientLinesSchema = new Schema({
    gradient: { type: Schema.Types.Mixed, required: true },
    points: { type: [CoordinateSchema], required: true },
});

const ProcedureSchema = new Schema<GradientGraphic> (
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
        segment: {
            type: Number,
            required: true,
        },
        axis: { type: AxisSchema, required: true },
        gradientLines: { type: [GradientLinesSchema], required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const GradientGraphicModel = model('gradientgraphics', ProcedureSchema);

export default GradientGraphicModel;