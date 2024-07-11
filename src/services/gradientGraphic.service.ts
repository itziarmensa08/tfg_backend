import GradientGraphicModel from "../models/gradientGraphic.model";
import { Coordinates, GradientGraphic, GradientLine } from "../interfaces/gradientGraphic.interface";



const obtainGradientGraphics = async () => {
    const response = await GradientGraphicModel.find({});
    return response;
}

const obtainGradientGraphic = async (id: string) => {
    const response = await GradientGraphicModel.findOne({_id: id});
    return response;
}

const obtainGradientGraphicByAircraft = async (idAircraft: string, segment: number) => {
    const response = await GradientGraphicModel.findOne({ aircraft: { $in: [idAircraft] }, segment: segment });
    return response;
}

const addGradientGraphic = async (GradientGraphic: GradientGraphic) => {
    const response = await GradientGraphicModel.create(GradientGraphic);
    return response;
}

const putGradientGraphic = async (id: string, GradientGraphic: GradientGraphic) => {
    const response = await GradientGraphicModel.findOneAndUpdate({_id: id}, GradientGraphic, {new: true});
    return response;
}

const removeGradientGraphic = async (id: string) => {
    const response = await GradientGraphicModel.findByIdAndDelete({_id: id});
    return response;
}

const addGradientLine = async (graphicId: string, gradientLine: GradientLine) => {
    const graphic = await GradientGraphicModel.findById(graphicId);
    if (!graphic) {
        throw new Error("Graphic not found");
    }
    graphic.gradientLines.push(gradientLine);
    const updatedGraphic = await GradientGraphicModel.findOneAndUpdate({_id: graphicId}, graphic, {new: true});
    return updatedGraphic;
};

const calculateDistance = async (graphicId: string, gradient: number, altitud: number) => {
    const graphic = await GradientGraphicModel.findById(graphicId);
    if (!graphic) {
        throw new Error("Graphic not found");
    }

    const { lower, upper } = findClosestGradientLines(graphic.gradientLines, gradient);
    if (!lower || !upper) {
        throw new Error("Cannot find suitable pressure lines for the given altitud");
    }

    let xFinal: number;
    if (lower === upper) {
        xFinal = interpolateWithinPressureLine(lower.points, altitud);
    } else {
        const xLower = interpolateWithinPressureLine(lower.points, altitud);
        const xUpper = interpolateWithinPressureLine(upper.points, altitud);

        xFinal = interpolate(
            typeof lower.gradient === 'number' ? lower.gradient : parseFloat(lower.gradient.toString()),
            xLower,
            typeof upper.gradient === 'number' ? upper.gradient : parseFloat(upper.gradient.toString()),
            xUpper,
            altitud
        );
    }

    const firstPoint: Coordinates = {x: graphic.axis.x[0], y: altitud};
    const secondPoint: Coordinates = {x: xFinal, y: altitud};
    const thirdPoint : Coordinates = {x: xFinal, y: graphic.axis.y[0]};
    return { firstPoint, secondPoint, thirdPoint };
};

function findClosestGradientLines(pressureLines: GradientLine[], gradient: number): { lower: GradientLine | null, upper: GradientLine | null } {
    let exactMatch: GradientLine | null = null;
    let lower: GradientLine | null = null;
    let upper: GradientLine | null = null;
    for (const line of pressureLines) {
        const lineAltitud = typeof line.gradient === 'number' ? line.gradient : parseFloat(line.gradient.toString());
        if (lineAltitud === gradient) {
            exactMatch = line;
            break;
        } else if (lineAltitud < gradient) {
            if (!lower || lineAltitud > (typeof lower.gradient === 'number' ? lower.gradient : parseFloat(lower.gradient.toString()))) {
                lower = line;
            }
        } else if (lineAltitud > gradient) {
            if (!upper || lineAltitud < (typeof upper.gradient === 'number' ? upper.gradient : parseFloat(upper.gradient.toString()))) {
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

export { obtainGradientGraphics, obtainGradientGraphic, obtainGradientGraphicByAircraft, addGradientGraphic, putGradientGraphic, removeGradientGraphic, addGradientLine, calculateDistance};