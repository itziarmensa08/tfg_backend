import {Schema, model} from "mongoose";
import { Procedure } from "../interfaces/procedure.interface";

const FirstSegmentSchema = new Schema({
    velocityIAS: { type: Number, required: true },
    density: { type: Number, required: true },
    velocityTAS: { type: Number, required: true },
    rateClimb: { type: Number, required: true },
    altitudeInDP: { type: Number },
    timeToFinish: { type: Number, required: true },
    distanceToFinish: { type: Number, required: true },
    timeToDP: { type: Number },
    reachDP: { type: Number },
    clearDP: { type: Number }
});

const SecondSegmentSchema = new Schema({
    velocityIAS: { type: Number, required: true },
    density: { type: Number, required: true },
    velocityTAS: { type: Number, required: true },
    rateClimb: { type: Number, required: true },
    altitudeInDP: { type: Number },
    timeToFinish: { type: Number, required: true },
    distanceToFinish: { type: Number, required: true },
    timeToDP: { type: Number },
    reachDP: { type: Number },
    clearDP: { type: Number }
});

const ThirdSegmentSchema = new Schema({
    velocityIAS: { type: Number, required: true },
    density: { type: Number, required: true },
    velocityTAS: { type: Number, required: true },
    rateClimb: { type: Number, required: true },
    altitudeInDP: { type: Number },
    timeToFinish: { type: Number, required: true },
    distanceToFinish: { type: Number, required: true },
    timeToDP: { type: Number },
    reachDP: { type: Number },
    clearDP: { type: Number }
});

const ProcedureSchema = new Schema<Procedure> (
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
        sidDoc: {
            type: String,
            required: true,
        },
        rwyDoc: {
            type: String,
            required: true,
        },
        sidName: {
            type: String,
            required: true,
        },
        rwyName: {
            type: String,
            required: true,
        },
        dpName: {
            type: String,
            required: true,
        },
        dpDistance: {
            type: Number,
            required: true,
        },
        dpAltitude: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        firstSegment: FirstSegmentSchema,
        secondSegment: SecondSegmentSchema,
        thirdSegment: ThirdSegmentSchema
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ProcedureModel = model('procedures', ProcedureSchema);

export default ProcedureModel;