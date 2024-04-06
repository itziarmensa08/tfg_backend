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
    weight: Number;
    firstSegment: FirstSegment,
    secondSegment: SecondSegment,
    thirdSegment: ThirdSegment
}

export interface FirstSegment {
    velocityIAS: Number,
    velocityTAS: Number,
    rateClimb: Number,
    distanceToDP: Number
}

export interface SecondSegment {
    velocityIAS: Number,
    velocityTAS: Number,
    rateClimb: Number,
    distanceToDP: Number
}

export interface ThirdSegment {
    velocityIAS: Number,
    velocityTAS: Number,
    rateClimb: Number,
    distanceToDP: Number
}