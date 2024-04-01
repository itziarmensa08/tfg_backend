import { ObjectId } from "mongoose";

export interface V2table {
    aircraft: ObjectId[];
    title: String;
    data: V2tableData[];
}

export interface V2tableData {
    pressure: Number;
    weight: Number;
    temperature: Number;
    velocityName: String;
    velocityValue: Number;
}