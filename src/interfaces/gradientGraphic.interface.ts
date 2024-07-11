import { ObjectId } from "mongoose";

export interface GradientGraphic {
    aircraft: ObjectId[];
    title: String;
    segment: number;
    axis: Axis;
    gradientLines: GradientLine[];
}

export interface Axis{
    x: number[];
    y: number[];
}

export interface GradientLine{
    gradient: Number;
    points: Coordinates[];
}

export interface Coordinates{
    x: number;
    y: number;
}