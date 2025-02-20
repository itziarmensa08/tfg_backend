import { ObjectId } from "mongoose";

export interface VXtable {
    aircraft: ObjectId[];
    title: String;
    rows: VXtableRow[];
    state: String;
}

export interface VXtableRow {
    pressure: number;
    weights: VXtableWeights[];
}

export interface VXtableWeights {
    weight: number;
    velocityValue: number;
}