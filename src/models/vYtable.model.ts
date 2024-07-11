import { Schema, model } from "mongoose";
import { VYtable } from "../interfaces/vYtable.interface";

const VYtablePressureSchema = new Schema(
    {
        pressureAltitude: {
            type: Number,
            required: true,
        },
        velocityValue: {
            type: Number,
            required: true,
        },
    }
);

const VYtableRowSchema = new Schema(
    {
        grossWeight: {
            type: Number,
            required: true,
        },
        pressures: {
            type: [VYtablePressureSchema],
            required: true,
        },
    }
);

const VYtableSchema = new Schema<VYtable>(
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
            type: [VYtableRowSchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const VYtableModel = model("vYtables", VYtableSchema);

export default VYtableModel;
