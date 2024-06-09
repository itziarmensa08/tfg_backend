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
    firstSegment: FirstSegment,
    secondSegment: SecondSegment,
    thirdSegment: ThirdSegment
}

export interface FirstSegment {
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

export interface SecondSegment {
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

export interface ThirdSegment {
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