import { ObjectId } from "mongoose";

export interface CrewProcedure {
    airport: ObjectId;
    aircraft: ObjectId;
    proceduresRWY: ProcedureRWY[];
}

export interface ProcedureRWY {
    rwy: string;
    procedures: ProcedureDetails[];
}

export interface ProcedureDetails {
    sids: string;
    procedure: string;
}