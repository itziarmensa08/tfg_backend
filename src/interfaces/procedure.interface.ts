import { ObjectId } from "mongoose";

export interface Procedure {
    airport: ObjectId;
    aircraft: ObjectId;
    sidDoc: String;
    rwyDoc: String;
    sidName: string;
    rwyName: string;
    dpName: string;
    dpDistance: Number;
    dpAltitude: Number;
    weight: Number;
    nMotors: NMotors;
    failure: Failure;
    procedureN: String;
    procedureN1: String;
}

export interface Segment {
    temperature: Number,
    velocityIAS: Number,
    density: Number,
    velocityTAS: Number,
    rateClimb: Number,
    timeToFinish: number,
    distanceToFinish: Number,
    altitudeInDP: number,
    timeToDP: Number,
    reachDP: Boolean,
    clearDP: Boolean
}

export interface NMotors {
    firstSegment: Segment,
    secondSegment: Segment,
    thirdSegment: Segment
}

export interface Failure {
    initialElevation: number,
    distanceToInitial: number,
    altitude: {
        state: Boolean,
        dpDistance: number,
        dpElevation: number,
        firstSegment: Segment,
        secondSegment: Segment,
        thirdSegment: Segment
    },
    gradient: {
        state: Boolean,
        dpDistance: number,
        gradientValue: number,
        finalGradient: number,
        firstSegment: Segment,
        secondSegment: Segment,
        thirdSegment: Segment
    },
}