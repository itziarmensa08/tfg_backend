import { ObjectId } from "mongoose";

export interface VYtable {
    aircraft: ObjectId[];
    title: String;
    rows: VYtableRow[];
}

export interface VYtableRow {
    grossWeight: number;
    pressures: VYtablePressure[];
}

export interface VYtablePressure {
    pressureAltitude: number;
    velocityValue: number;
}
