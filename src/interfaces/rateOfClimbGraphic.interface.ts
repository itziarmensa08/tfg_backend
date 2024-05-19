import { ObjectId } from "mongoose";

export interface RateOfClimbGraphic {
    aircraft: ObjectId[];
    title: String;
    velocity: String;
    axis: Axis;
    pressureLines: PressureLine[];
    weightLines: WeightLines[];
    referenceLine: Coordinates[];
}

export interface Axis{
    x: Number[];
    y: Number[];
}

export interface PressureLine{
    altitud: Number | String;
    points: Coordinates[];
}

export interface WeightLines{
    points: Coordinates[];
}

export interface Coordinates{
    x: Number;
    y: Number;
}