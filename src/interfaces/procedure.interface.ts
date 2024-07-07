import { ObjectId } from "mongoose";

export interface Procedure {
    airport: ObjectId;
    aircraft: ObjectId;
    sidDoc: String;
    rwyDoc: String;
    sidName: String;
    rwyName: String;
    dpName: String;
    dpDistance: Number;
    dpAltitude: Number;
    weight: Number;
    nMotors: NMotors;
    failure: Failure;
}

export interface Segment {
    velocityIAS: Number,
    density: Number,
    velocityTAS: Number,
    rateClimb: Number,
    timeToFinish: Number,
    distanceToFinish: Number,
    altitudeInDP: Number,
    timeToDP: Number,
    reachDP: boolean,
    clearDP: boolean
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
        state: boolean,
        dpDistance: number,
        dpElevation: number,
        firstSegment: Segment,
        secondSegment: Segment,
        thirdSegment: Segment
    },
    gradient: {
        state: boolean,
        dpDistance: number,
        gradientValue: number
    },
}