import { ObjectId } from "mongoose";

export interface RateOfClimbGraphic {
    aircraft: ObjectId[];
    title: String;
    velocity: String;
    segment: number;
    axis: Axis;
    pressureLines: PressureLine[];
    weightLines: WeightLines[];
    referenceLine: Coordinates[];
}

export interface Axis{
    x: number[];
    yWeight: number[];
    yAltitud: number[];
}

export interface PressureLine{
    altitud: Number | String;
    points: Coordinates[];
}

export interface WeightLines{
    points: Coordinates[];
}

export interface Coordinates{
    x: number;
    y: number;
}