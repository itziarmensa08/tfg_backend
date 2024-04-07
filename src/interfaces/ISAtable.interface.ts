export interface ISAtable {
    title: String;
    data: ISAtableData[];
}

export interface ISAtableData {
    altitudeFeet: Number;
    temperature: Number;
    pressure: Pressure;
    pressureRatio: Number;
    density: Number;
    speedSound: Number;
    altitudeMeters: Number;
}

export interface Pressure {
    hPa: Number;
    PSI: Number;
    InHg: Number;
}