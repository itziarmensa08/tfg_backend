import { ObjectId } from "mongoose";

export interface V2table {
    aircraft: ObjectId[];
    title: String;
    rows: V2tableRow[];
    temperatures: number[];
}

export interface V2tableRow{
    pressure: Number;
    weight: Number;
    data: V2tableData[];
}

export interface V2tableData{
    temperature: Number;
    velocityName: String;
    velocityValue: Number;
}