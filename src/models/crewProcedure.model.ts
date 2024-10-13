import { Schema, model } from "mongoose";
import { CrewProcedure } from "../interfaces/crewProcedure.interface";

const CrewProcedureSchema = new Schema<CrewProcedure>(
    {
        airport: {
            type: Schema.Types.ObjectId,
            ref: 'airports',
            required: true,
        },
        aircraft: {
            type: Schema.Types.ObjectId,
            ref: 'aircrafts',
            required: true,
        },
        proceduresRWY: [
            {
                rwy: {
                    type: String,
                    required: true,
                },
                procedures: [
                    {
                        sids: {
                            type: String,
                            required: true,
                        },
                        procedure: {
                            type: String,
                            required: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const CrewProcedureModel = model('crewProcedures', CrewProcedureSchema);

export default CrewProcedureModel;
