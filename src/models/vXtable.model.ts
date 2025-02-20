import { Schema, model } from "mongoose";
import { VXtable } from "../interfaces/vXtable.interface";

const VXtableWeightSchema = new Schema(
    {
        weight: {
            type: Number,
            required: true,
        },
        velocityValue: {
            type: Number,
            required: true,
        },
    }
);

const VXtableRowSchema = new Schema(
    {
        pressure: {
            type: Number,
            required: true,
        },
        weights: {
            type: [VXtableWeightSchema],
            required: true,
        },
    }
);

const VXtableSchema = new Schema<VXtable>(
    {
        aircraft: {
            type: [Schema.Types.ObjectId],
            ref: "aircrafts",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        rows: {
            type: [VXtableRowSchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const VXtableModel = model("vXtables", VXtableSchema);

export default VXtableModel;
