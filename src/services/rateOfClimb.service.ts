import { Coordinates, PressureLine, RateOfClimbGraphic, WeightLines } from "../interfaces/rateOfClimbGraphic.interface";
import RateOfClimbGrpahicModel from "../models/rateOfClimb.model";


const obtainRateOfClimbGraphics = async () => {
    const response = await RateOfClimbGrpahicModel.find({});
    return response;
}

const obtainRateOfClimbGraphic = async (id: string) => {
    const response = await RateOfClimbGrpahicModel.findOne({_id: id});
    return response;
}

const obtainRateOfClimbGraphicByAircraft = async (idAircraft: string) => {
    const response = await RateOfClimbGrpahicModel.findOne({ aircraft: { $in: [idAircraft] } });
    return response;
}

const addRateOfClimbGraphic = async (rateOfClimbGraphic: RateOfClimbGraphic) => {
    const response = await RateOfClimbGrpahicModel.create(rateOfClimbGraphic);
    return response;
}

const putRateOfClimbGraphic = async (id: string, rateOfClimbGraphic: RateOfClimbGraphic) => {
    const response = await RateOfClimbGrpahicModel.findOneAndUpdate({_id: id}, rateOfClimbGraphic, {new: true});
    return response;
}

const removeRateOfClimbGraphic = async (id: string) => {
    const response = await RateOfClimbGrpahicModel.findByIdAndDelete({_id: id});
    return response;
}

const addPressureLine = async (graphicId: string, pressureLine: PressureLine) => {
    const graphic = await RateOfClimbGrpahicModel.findById(graphicId);
    if (!graphic) {
        throw new Error("Graphic not found");
    }
    graphic.pressureLines.push(pressureLine);
    const updatedGraphic = await RateOfClimbGrpahicModel.findOneAndUpdate({_id: graphicId}, graphic, {new: true});
    return updatedGraphic;
};

const addWeightLine = async (graphicId: string, weightLine: WeightLines) => {
    const graphic = await RateOfClimbGrpahicModel.findById(graphicId);
    if (!graphic) {
        throw new Error("Graphic not found");
    }
    graphic.weightLines.push(weightLine);
    const updatedGraphic = await RateOfClimbGrpahicModel.findOneAndUpdate({_id: graphicId}, graphic, {new: true});
    return updatedGraphic;
};

const calculateRate = async (graphicId: string, temperature: number, altitud: number, weight: number) => {
    const graphic = await RateOfClimbGrpahicModel.findById(graphicId);
    if (!graphic) {
        throw new Error("Graphic not found");
    }

    const { lower, upper } = findClosestPressureLines(graphic.pressureLines, altitud);
    if (!lower || !upper) {
        throw new Error("Cannot find suitable pressure lines for the given altitud");
    }

    let xFinal: number;
    if (lower === upper) {
        xFinal = interpolateWithinPressureLine(lower.points, temperature);
    } else {
        const xLower = interpolateWithinPressureLine(lower.points, temperature);
        const xUpper = interpolateWithinPressureLine(upper.points, temperature);

        xFinal = interpolate(
            typeof lower.altitud === 'number' ? lower.altitud : parseFloat(lower.altitud.toString()),
            xLower,
            typeof upper.altitud === 'number' ? upper.altitud : parseFloat(upper.altitud.toString()),
            xUpper,
            altitud
        );
    }

    const firstPoint: Coordinates = {x: graphic.axis.x[0], y: temperature};
    const secondPoint: Coordinates = {x: xFinal, y: temperature};
    const thirdPoint : Coordinates = {x: xFinal, y: graphic.axis.yAltitud[0]};

    const weightClosest = findClosestWeightLine(graphic.weightLines, xFinal);
    if (!weightClosest) {
        throw new Error("Cannot find suitable weight lines for the given xFinal");
    }

    const lastWeightPoint = weightClosest.points[weightClosest.points.length - 1];
    const xDifference = xFinal - lastWeightPoint.x;

    let adjustedPoints: Coordinates[] = weightClosest.points.map(point => ({
        x: point.x + xDifference,
        y: point.y
    }));

    let lowerPoint: Coordinates | undefined;
    let upperPoint: Coordinates | undefined;
    for (let i = 0; i < adjustedPoints.length; i++) {
        if (adjustedPoints[i].y >= (weight/1000)) {
            upperPoint = adjustedPoints[i];
            lowerPoint = adjustedPoints[i - 1];
            break;
        }
    }

    if (lowerPoint && upperPoint && !adjustedPoints.some(point => point.y === (weight/1000))) {
        const interpolatedX = interpolate(
            lowerPoint.y,
            lowerPoint.x,
            upperPoint.y,
            upperPoint.x,
            (weight/1000)
        );
        adjustedPoints.push({ x: interpolatedX, y: (weight/1000) });
        adjustedPoints.sort((a, b) => a.x - b.x);
    }

    adjustedPoints = adjustedPoints.filter(point => point.y >= (weight/1000));

    const finalPoint : Coordinates = {x: adjustedPoints[adjustedPoints.length - 1].x, y: graphic.axis.yWeight[0]};

    return { firstPoint, secondPoint, thirdPoint, adjustedPoints, finalPoint };
};

function findClosestPressureLines(pressureLines: PressureLine[], altitud: number): { lower: PressureLine | null, upper: PressureLine | null } {
    let exactMatch: PressureLine | null = null;
    let lower: PressureLine | null = null;
    let upper: PressureLine | null = null;
    for (const line of pressureLines) {
        const lineAltitud = typeof line.altitud === 'number' ? line.altitud : parseFloat(line.altitud.toString());
        if (lineAltitud === altitud) {
            exactMatch = line;
            break;
        } else if (lineAltitud < altitud) {
            if (!lower || lineAltitud > (typeof lower.altitud === 'number' ? lower.altitud : parseFloat(lower.altitud.toString()))) {
                lower = line;
            }
        } else if (lineAltitud > altitud) {
            if (!upper || lineAltitud < (typeof upper.altitud === 'number' ? upper.altitud : parseFloat(upper.altitud.toString()))) {
                upper = line;
            }
        }
    }
    if (exactMatch) {
        return { lower: exactMatch, upper: exactMatch };
    }
    return { lower, upper };
}

function interpolateWithinPressureLine(points: Coordinates[], temperature: number): number {
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        if ((p1.y <= temperature && p2.y >= temperature) || (p1.y >= temperature && p2.y <= temperature)) {
            return interpolate(p1.y, p1.x, p2.y, p2.x, temperature);
        }
    }
    throw new Error("Temperature is out of the bounds of the given points");
}

function interpolate(x1: number, y1: number, x2: number, y2: number, x: number): number {
    return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
}

function findClosestWeightLine(weightLines: WeightLines[], xFinal: number): WeightLines | null {
    let closest: WeightLines | null = null;
    for (const line of weightLines) {
        const lastPoint = line.points[line.points.length - 1];
        if (!closest || Math.abs(lastPoint.x - xFinal) < Math.abs(closest.points[closest.points.length - 1].x - xFinal)) {
            closest = line;
        }
    }
    return closest;
}

function interpolateWithinWeightLine(points: Coordinates[], x: number): number {
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        if ((p1.x <= x && p2.x >= x) || (p1.x >= x && p2.x <= x)) {
            return interpolate(p1.x, p1.y, p2.x, p2.y, x);
        }
    }
    throw new Error("x is out of the bounds of the given points");
}

export { obtainRateOfClimbGraphics, obtainRateOfClimbGraphic, obtainRateOfClimbGraphicByAircraft, addRateOfClimbGraphic, putRateOfClimbGraphic, removeRateOfClimbGraphic, addPressureLine, addWeightLine, calculateRate };