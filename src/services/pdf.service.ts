import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { Procedure } from '../interfaces/procedure.interface';
import { Aircraft } from '../interfaces/aircraft.interface';
import { obtainAircraft } from './aircraft.service';
import { Airport } from '../interfaces/airport.interface';
import { obtainAirport } from './airport.service';

const generatePdfList = async (procedures: Procedure[], templatePath: string, outputPath: string) => {
  let combinedHtml = '';
  for (const procedure of procedures) {
    let html = fs.readFileSync(templatePath, 'utf-8');

    const aircraft: Aircraft | null = await obtainAircraft(procedure.aircraft.toString())

    const metro = aircraft?.metro?.toString() || '';

    html = html.replace('{{metro}}', metro);

    const airport: Airport | null = await obtainAirport(procedure.airport.toString())

    const iataCode = airport?.iataCode ?? '';
    const oaciCode = airport?.oaciCode ?? '';

    html = html.replace('{{airport1}}', iataCode[0] || '');
    html = html.replace('{{airport2}}', iataCode[1] || '');
    html = html.replace('{{airport3}}', iataCode[2] || '');
    html = html.replace('{{airport4}}', oaciCode[0] || '');
    html = html.replace('{{airport5}}', oaciCode[1] || '');
    html = html.replace('{{airport6}}', oaciCode[2] || '');
    html = html.replace('{{airport7}}', oaciCode[3] || '');

    const rwy = procedure.rwyName || ''

    html = html.replace('{{rwy}}', rwy);

    const sids = procedure.sidName || ''

    html = html.replace('{{sids}}', sids);

    const dp = procedure.dpName || ''

    html = html.replace('{{dp}}', dp);

    const heightN1 = aircraft?.profile.nMotors.heightFirstSegment || ''

    html = html.replace('{{heightN1}}', heightN1.toString());

    html = html.replace('{{heightN1}}', heightN1.toString());

    const heightN2 = aircraft?.profile.nMotors.heightSecondSegment || ''

    html = html.replace('{{heightN2}}', heightN2.toString());

    const heightN3 = aircraft?.profile.nMotors.heightSecondSegment || ''

    html = html.replace('{{heightN3}}', heightN3.toString());

    const elevation = airport?.elevation || ''

    html = html.replace('{{elevation}}', elevation.toString());

    const temp = airport?.referenceTemperature || ''

    html = html.replace('{{temp}}', temp.toString());

    const dpDistance = procedure?.dpDistance || ''

    html = html.replace('{{dpDistance}}', dpDistance.toString());

    const dpAltitude = procedure?.dpAltitude || ''

    html = html.replace('{{dpAltitude}}', dpAltitude.toString());

    const weight = procedure?.weight || ''

    if (procedure.nMotors.firstSegment) {
      html = html.replace('{{#if firstSegmentN}}', '');
      html = html.replace('{{/if firstSegmentN}}', '');
      const iasN1 = procedure?.nMotors.firstSegment.velocityIAS || ''

      html = html.replace('{{iasN1}}', iasN1.toFixed(2).toString());

      const tasN1 = procedure?.nMotors.firstSegment.velocityTAS || ''

      html = html.replace('{{tasN1}}', tasN1.toFixed(2).toString());

      html = html.replace('{{weight}}', weight.toString());

      html = html.replace('{{temp}}', temp.toString());

      const rateN1 = procedure?.nMotors.firstSegment.rateClimb;

      html = html.replace('{{rateN1}}', rateN1.toFixed(2).toString());
    } else {
      html = html.replace(/{{#if firstSegmentN}}[\s\S]*?{{\/if firstSegmentN}}/g, '');
    }

    if (procedure.nMotors.firstSegment.reachDP == false) {
      const descN1 = `
        <p>Tardamos en recorrer este primer segmento:</p>
        <p style="text-align: center;">
          t = (${aircraft?.profile.nMotors.heightFirstSegment} ft - 50 ft) / (${procedure.nMotors.firstSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.firstSegment.timeToFinish.toFixed(5)} min = ${(procedure.nMotors.firstSegment.timeToFinish / 60).toFixed(5)} h
        </p>
        <p>Y recorremos una distancia de:</p>
        <p style="text-align: center;">
          d = ${(procedure.nMotors.firstSegment.timeToFinish / 60).toFixed(5)} h * ${procedure.nMotors.firstSegment.velocityTAS.toFixed(2)} NM/h = ${procedure.nMotors.firstSegment.distanceToFinish.toFixed(2)} NM
        </p>
        <p>En este punto aún no hemos alcanzado el DP.</p>
      `;
      html = html.replace('{{descN1}}', descN1.toString());
    } else {
      if (procedure.nMotors.firstSegment.clearDP == true) {
        const descN1 = `
          <p>Tardamos en recorrer este primer segmento:</p>
          <p style="text-align: center;">
            t = (${aircraft?.profile.nMotors.heightFirstSegment} ft - 50 ft) / (${procedure.nMotors.firstSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.firstSegment.timeToFinish.toFixed(5)} min = ${(procedure.nMotors.firstSegment.timeToFinish / 60).toFixed(5)} h
          </p>
          <p>Y recorremos una distancia de:</p>
          <p style="text-align: center;">
            d = ${(procedure.nMotors.firstSegment.timeToFinish / 60).toFixed(5)} h * ${procedure.nMotors.firstSegment.velocityTAS.toFixed(2)} NM/h = ${procedure.nMotors.firstSegment.distanceToFinish.toFixed(2)} NM
          </p>
          <p>En este punto ya hemos alcanzado el DP y hemos tardado en alcanzarlo:</p>
          <p style="text-align: center;">
            t = ${(procedure.dpDistance)} NM / (${procedure.nMotors.firstSegment.velocityTAS.toFixed(2)} NM/h) * 60 min/h = ${procedure.nMotors.firstSegment.timeToDP.toFixed(5)} min
          </p>
          <p>Y hemos alcanzado una altitud de:</p>
          <p style="text-align: center;">
            h = ${(procedure.nMotors.firstSegment.timeToDP.toFixed(5))} min * (${procedure.nMotors.firstSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.firstSegment.altitudeInDP.toFixed(2)} ft
          </p>
          <p>Por lo tanto, sobrepasamos las restricciones.</p>
        `;
        html = html.replace('{{descN1}}', descN1.toString());
      } else {
        const descN1 = `
          <p>Tardamos en recorrer este primer segmento:</p>
          <p style="text-align: center;">
            t = (${aircraft?.profile.nMotors.heightFirstSegment} ft - 50 ft) / (${procedure.nMotors.firstSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.firstSegment.timeToFinish.toFixed(5)} min = ${(procedure.nMotors.firstSegment.timeToFinish / 60).toFixed(5)} h
          </p>
          <p>Y recorremos una distancia de:</p>
          <p style="text-align: center;">
            d = ${(procedure.nMotors.firstSegment.timeToFinish / 60).toFixed(5)} h * ${procedure.nMotors.firstSegment.velocityTAS.toFixed(2)} NM/h = ${procedure.nMotors.firstSegment.distanceToFinish.toFixed(2)} NM
          </p>
          <p>En este punto ya hemos alcanzado el DP y hemos tardado en alcanzarlo:</p>
          <p style="text-align: center;">
            t = ${(procedure.dpDistance)} NM / (${procedure.nMotors.firstSegment.velocityTAS.toFixed(2)} NM/h) * 60 min/h = ${procedure.nMotors.firstSegment.timeToDP.toFixed(5)} min
          </p>
          <p>Y hemos alcanzado una altitud de:</p>
          <p style="text-align: center;">
            h = ${(procedure.nMotors.firstSegment.timeToDP.toFixed(5))} min * (${procedure.nMotors.firstSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.firstSegment.altitudeInDP.toFixed(2)} ft
          </p>
          <p>Por lo tanto, no sobrepasamos las restricciones.</p>
        `;
        html = html.replace('{{descN1}}', descN1.toString());
      }
    }

    if (procedure.nMotors.secondSegment) {
      html = html.replace('{{#if secondSegmentN}}', '');
      html = html.replace('{{/if secondSegmentN}}', '');
      const iasN2 = procedure?.nMotors.secondSegment.velocityIAS || ''

      html = html.replace('{{iasN2}}', iasN2.toFixed(2).toString());

      const tasN2 = procedure?.nMotors.secondSegment.velocityTAS || ''

      html = html.replace('{{tasN2}}', tasN2.toFixed(2).toString());

      html = html.replace('{{weight}}', weight.toString());

      html = html.replace('{{temp}}', temp.toString());

      const rateN2 = procedure?.nMotors.secondSegment.rateClimb;

      html = html.replace('{{rateN2}}', rateN2.toFixed(2).toString());

      if (!procedure.nMotors.secondSegment.reachDP) {
        const descN2 = `
          <p>Tardamos en recorrer este segundo segmento:</p>
          <p style="text-align: center;">
            t = (${aircraft?.profile.nMotors.heightSecondSegment} ft - ${aircraft?.profile.nMotors.heightFirstSegment} ft) / (${procedure.nMotors.secondSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.secondSegment.timeToFinish.toFixed(5)} min = ${(procedure.nMotors.secondSegment.timeToFinish / 60).toFixed(5)} h
          </p>
          <p>Y recorremos una distancia de:</p>
          <p style="text-align: center;">
            d = ${(procedure.nMotors.secondSegment.timeToFinish / 60).toFixed(5)} h * ${procedure.nMotors.secondSegment.velocityTAS.toFixed(2)} NM/h = ${procedure.nMotors.secondSegment.distanceToFinish.toFixed(2)} NM
          </p>
          <p>En este punto aún no hemos alcanzado el DP.</p>
        `;
        html = html.replace('{{descN2}}', descN2.toString());
      } else {
        if (procedure.nMotors.secondSegment.clearDP) {
          const descN2 = `
            <p>Tardamos en recorrer este segundo segmento:</p>
            <p style="text-align: center;">
              t = (${aircraft?.profile.nMotors.heightSecondSegment} ft - ${aircraft?.profile.nMotors.heightFirstSegment} ft) / (${procedure.nMotors.secondSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.secondSegment.timeToFinish.toFixed(5)} min = ${(procedure.nMotors.secondSegment.timeToFinish / 60).toFixed(5)} h
            </p>
            <p>Y recorremos una distancia de:</p>
            <p style="text-align: center;">
              d = ${(procedure.nMotors.secondSegment.timeToFinish / 60).toFixed(5)} h * ${procedure.nMotors.secondSegment.velocityTAS.toFixed(2)} NM/h = ${procedure.nMotors.secondSegment.distanceToFinish.toFixed(2)} NM
            </p>
            <p>En este punto ya hemos alcanzado el DP y hemos tardado en alcanzarlo:</p>
            <p style="text-align: center;">
              t = (${(procedure.dpDistance)} NM - ${(procedure.nMotors.firstSegment.distanceToFinish.toFixed(2))} NM) / (${procedure.nMotors.secondSegment.velocityTAS.toFixed(2)} NM/h) * 60 min/h = ${procedure.nMotors.secondSegment.timeToDP.toFixed(5)} min
            </p>
            <p>Y hemos subido desde el principio del segmento:</p>
            <p style="text-align: center;">
              h = ${(procedure.nMotors.secondSegment.timeToDP.toFixed(5))} min * (${procedure.nMotors.secondSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.secondSegment.altitudeInDP.toFixed(2)} ft
            </p>
            <p>Por lo tanto hemos alcanzado una altitud de:</p>
            <p style="text-align: center;">
              h = ${procedure.nMotors.secondSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.nMotors.heightFirstSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.nMotors.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightFirstSegment!).toFixed(2)} ft
            </p>
            <p>Por lo tanto, sobrepasamos las restricciones.</p>
          `;
          html = html.replace('{{descN2}}', descN2.toString());
        } else {
          const descN2 = `
            <p>Tardamos en recorrer este segundo segmento:</p>
            <p style="text-align: center;">
              t = (${aircraft?.profile.nMotors.heightSecondSegment} ft - ${aircraft?.profile.nMotors.heightFirstSegment} ft) / (${procedure.nMotors.secondSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.secondSegment.timeToFinish.toFixed(5)} min = ${(procedure.nMotors.secondSegment.timeToFinish / 60).toFixed(5)} h
            </p>
            <p>Y recorremos una distancia de:</p>
            <p style="text-align: center;">
              d = ${(procedure.nMotors.secondSegment.timeToFinish / 60).toFixed(5)} h * ${procedure.nMotors.secondSegment.velocityTAS.toFixed(2)} NM/h = ${procedure.nMotors.secondSegment.distanceToFinish.toFixed(2)} NM
            </p>
            <p>En este punto ya hemos alcanzado el DP y hemos tardado en alcanzarlo:</p>
            <p style="text-align: center;">
              t = (${(procedure.dpDistance)} NM - ${(procedure.nMotors.firstSegment.distanceToFinish.toFixed(2))} NM) / (${procedure.nMotors.secondSegment.velocityTAS.toFixed(2)} NM/h) * 60 min/h = ${procedure.nMotors.secondSegment.timeToDP.toFixed(5)} min
            </p>
            <p>Y hemos subido desde el principio del segmento:</p>
            <p style="text-align: center;">
              h = ${(procedure.nMotors.secondSegment.timeToDP.toFixed(5))} min * (${procedure.nMotors.secondSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.secondSegment.altitudeInDP.toFixed(2)} ft
            </p>
            <p>Por lo tanto hemos alcanzado una altitud de:</p>
            <p style="text-align: center;">
              h = ${procedure.nMotors.secondSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.nMotors.heightFirstSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.nMotors.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightFirstSegment!).toFixed(2)} ft
            </p>
            <p>Por lo tanto, no sobrepasamos las restricciones.</p>
          `;
          html = html.replace('{{descN2}}', descN2.toString());
        }
      }
    } else {
      html = html.replace(/{{#if secondSegmentN}}[\s\S]*?{{\/if secondSegmentN}}/g, '');
    }

    if (procedure.nMotors.thirdSegment) {
      html = html.replace('{{#if thirdSegmentN}}', '');
      html = html.replace('{{/if thirdSegmentN}}', '');
      const iasN3 = procedure?.nMotors.thirdSegment.velocityIAS || ''

      html = html.replace('{{iasN3}}', iasN3.toFixed(2).toString());

      const tasN3 = procedure?.nMotors.thirdSegment.velocityTAS || ''

      html = html.replace('{{tasN3}}', tasN3.toFixed(2).toString());

      html = html.replace('{{weight}}', weight.toString());

      html = html.replace('{{temp}}', temp.toString());

      const rateN3 = procedure?.nMotors.thirdSegment.rateClimb;

      html = html.replace('{{rateN3}}', rateN3.toFixed(2).toString());

      if (procedure.nMotors.thirdSegment.clearDP) {
        const descN3 = `
            <p>Tardamos en alcanzar el DP:</p>
            <p style="text-align: center;">
              t = (${(procedure.dpDistance)} NM - ${(procedure.nMotors.firstSegment.distanceToFinish.toFixed(2))} NM) - ${(procedure.nMotors.secondSegment.distanceToFinish.toFixed(2))} NM) / (${procedure.nMotors.thirdSegment.velocityTAS.toFixed(2)} NM/h) * 60 min/h = ${procedure.nMotors.thirdSegment.timeToDP.toFixed(5)} min
            </p>
            <p>Y hemos subido desde el principio del segmento:</p>
            <p style="text-align: center;">
              h = ${(procedure.nMotors.thirdSegment.timeToDP.toFixed(5))} min * (${procedure.nMotors.thirdSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.thirdSegment.altitudeInDP.toFixed(2)} ft
            </p>
            <p>Por lo tanto hemos alcanzado una altitud de:</p>
            <p style="text-align: center;">
              h = ${procedure.nMotors.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.nMotors.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.nMotors.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightSecondSegment!).toFixed(2)} ft
            </p>
            <p>Por lo tanto, sobrepasamos las restricciones.</p>
          `;
        html = html.replace('{{descN3}}', descN3.toString());
      } else {
        const descN3 = `
            <p>Tardamos en alcanzar el DP:</p>
            <p style="text-align: center;">
              t = (${(procedure.dpDistance)} NM - ${(procedure.nMotors.firstSegment.distanceToFinish.toFixed(2))} NM) - ${(procedure.nMotors.secondSegment.distanceToFinish.toFixed(2))} NM) / (${procedure.nMotors.thirdSegment.velocityTAS.toFixed(2)} NM/h) * 60 min/h = ${procedure.nMotors.thirdSegment.timeToDP.toFixed(5)} min
            </p>
            <p>Y hemos subido desde el principio del segmento:</p>
            <p style="text-align: center;">
              h = ${(procedure.nMotors.thirdSegment.timeToDP.toFixed(5))} min * (${procedure.nMotors.thirdSegment.rateClimb.toFixed(2)} ft/min) = ${procedure.nMotors.thirdSegment.altitudeInDP.toFixed(2)} ft
            </p>
            <p>Por lo tanto hemos alcanzado una altitud de:</p>
            <p style="text-align: center;">
              h = ${procedure.nMotors.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.nMotors.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.nMotors.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightSecondSegment!).toFixed(2)} ft
            </p>
            <p>Por lo tanto, no sobrepasamos las restricciones.</p>
          `;
        html = html.replace('{{descN3}}', descN3.toString());
      }
    } else {
      html = html.replace(/{{#if thirdSegmentN}}[\s\S]*?{{\/if thirdSegmentN}}/g, '');
    }

    if (procedure.failure && procedure.failure.gradient && procedure.failure.gradient.state) {
      html = html.replace('{{#if gradientRestriction}}', '');
      html = html.replace('{{/if gradientRestriction}}', '');

      const distanceGradientRestriction = procedure?.failure.gradient.dpDistance;

      html = html.replace('{{distanceGradientRestriction}}', distanceGradientRestriction.toFixed(2).toString());

      const minimGradient = procedure?.failure.gradient.gradientValue;

      html = html.replace('{{minimGradient}}', minimGradient.toFixed(2).toString());

      if (procedure.failure.gradient.firstSegment && procedure.failure.gradient.firstSegment.velocityIAS) {
        html = html.replace('{{#if firstSegmentGradientRestriction}}', '');
        html = html.replace('{{/if firstSegmentGradientRestriction}}', '');

        const height1Failure = aircraft?.profile.failure.heightFirstSegment.toFixed(2).toString() || '';

        html = html.replace('{{height1Failure}}', height1Failure.toString());

        const iasGradient1 = procedure?.failure.gradient.firstSegment.velocityIAS.toFixed(2).toString();

        html = html.replace('{{iasGradient1}}', iasGradient1.toString());

        const tasGradient1 = procedure?.failure.gradient.firstSegment.velocityTAS.toFixed(2).toString();

        html = html.replace('{{tasGradient1}}', tasGradient1.toString());

        const gradient1 = procedure?.failure.gradient.firstSegment.rateClimb.toFixed(2).toString();

        html = html.replace('{{gradient1}}', gradient1.toString());

        if (!procedure.failure.gradient.firstSegment.reachDP) {
          const descGradient1 = 'Hasta terminar este segmento, recorremos una distancia de ' + procedure.failure.gradient.firstSegment.distanceToFinish.toFixed(2) +
                      ' NM. En este punto aún no hemos alcanzado la distancia.';
          html = html.replace('{{descGradient1}}', descGradient1.toString());
        } else {
          if (procedure.failure.gradient.firstSegment.clearDP) {
            const descGradient1 = `
              <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.gradient.firstSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
              <p style="text-align: center;">
                h = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.gradient.firstSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.gradient.firstSegment.altitudeInDP.toFixed(2)}
              </p>
              <p>Por lo tanto hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${(procedure.failure.gradient.firstSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.gradient.firstSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Y un gradiente de:</p>
              <p style="text-align: center;">
                gradiente = ((${(procedure.failure.gradient.firstSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
              </p>
              <p>Por lo tanto, sobrepasamos las restricciones.</p>
            `;
            html = html.replace('{{descGradient1}}', descGradient1.toString());
          } else {
            const descGradient1 = `
              <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.gradient.firstSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
              <p style="text-align: center;">
                h = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.gradient.firstSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.gradient.firstSegment.altitudeInDP.toFixed(2)}
              </p>
              <p>Por lo tanto hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${(procedure.failure.gradient.firstSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.gradient.firstSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Y un gradiente de:</p>
              <p style="text-align: center;">
                gradiente = ((${(procedure.failure.gradient.firstSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
              </p>
              <p>Por lo tanto, no sobrepasamos las restricciones.</p>
            `;
            html = html.replace('{{descGradient1}}', descGradient1.toString());
          }
        }

      } else {
        html = html.replace(/{{#if firstSegmentGradientRestriction}}[\s\S]*?{{\/if firstSegmentGradientRestriction}}/g, '');
      }

      if (procedure.failure.gradient.secondSegment && procedure.failure.gradient.secondSegment.velocityIAS) {
        html = html.replace('{{#if secondSegmentGradientRestriction}}', '');
        html = html.replace('{{/if secondSegmentGradientRestriction}}', '');

        const height1Failure = aircraft?.profile.failure.heightFirstSegment.toFixed(2).toString() || '';

        html = html.replace('{{height1Failure}}', height1Failure.toString());

        const height2Failure = aircraft?.profile.failure.heightSecondSegment.toFixed(2).toString() || '';

        html = html.replace('{{height2Failure}}', height2Failure.toString());

        const iasGradient2 = procedure?.failure.gradient.secondSegment.velocityIAS.toFixed(2).toString();

        html = html.replace('{{iasGradient2}}', iasGradient2.toString());

        const tasGradient2 = procedure?.failure.gradient.secondSegment.velocityTAS.toFixed(2).toString();

        html = html.replace('{{tasGradient2}}', tasGradient2.toString());

        const gradient2 = procedure?.failure.gradient.secondSegment.rateClimb.toFixed(2).toString();

        html = html.replace('{{gradient2}}', gradient2.toString());

        if (!procedure.failure.gradient.secondSegment.reachDP) {
          const descGradient2 = 'Hasta terminar este segmento, recorremos una distancia de ' + procedure.failure.gradient.secondSegment.distanceToFinish.toFixed(2) +
                      ' NM. En este punto aún no hemos alcanzado la distancia.';
          html = html.replace('{{descGradient2}}', descGradient2.toString());
        } else {
          if (procedure.failure.gradient.secondSegment.clearDP) {
            var descGradient2 = '';
            if (procedure.failure.initialElevation > aircraft?.profile.failure.heightFirstSegment!) {
              descGradient2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.gradient.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.gradient.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.gradient.secondSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
                </p>
                <p>Y un gradiente de:</p>
                <p style="text-align: center;">
                  gradiente = ((${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
                </p>
                <p>Por lo tanto, sobrepasamos las restricciones.</p>
              `;
            } else {
              descGradient2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.gradient.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM - ${procedure.failure.gradient.firstSegment.distanceToFinish} NM) * 6076.12 ft/NM * ${(procedure.failure.gradient.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${aircraft?.profile.failure.heightFirstSegment.toFixed(2)} ft + ${airport?.elevation!} ft = ${(procedure.failure.gradient.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
                </p>
                <p>Y un gradiente de:</p>
                <p style="text-align: center;">
                  gradiente = ((${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft + ${airport?.elevation!} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
                </p>
                <p>Por lo tanto, sobrepasamos las restricciones.</p>
              `;
            }
            html = html.replace('{{descGradient1}}', descGradient2.toString());
          } else {
            var descGradient2 = '';
            if (procedure.failure.initialElevation > aircraft?.profile.failure.heightFirstSegment!) {
              descGradient2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.gradient.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.gradient.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.gradient.secondSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
                </p>
                <p>Y un gradiente de:</p>
                <p style="text-align: center;">
                  gradiente = ((${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
                </p>
                <p>Por lo tanto, no sobrepasamos las restricciones.</p>
              `;
            } else {
              descGradient2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.gradient.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - ${procedure.failure.gradient.firstSegment.distanceToFinish} NM) * 6076.12 ft/NM * ${(procedure.failure.gradient.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${aircraft?.profile.failure.heightFirstSegment.toFixed(2)} ft + ${airport?.elevation!} ft = ${(procedure.failure.gradient.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
                </p>
                <p>Y un gradiente de:</p>
                <p style="text-align: center;">
                  gradiente = ((${(procedure.failure.gradient.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft + ${airport?.elevation!} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
                </p>
                <p>Por lo tanto, no sobrepasamos las restricciones.</p>
              `;
            }
            html = html.replace('{{descGradient1}}', descGradient2.toString());
          }
        }

      } else {
        html = html.replace(/{{#if secondSegmentGradientRestriction}}[\s\S]*?{{\/if secondSegmentGradientRestriction}}/g, '');
      }

      if (procedure.failure.gradient.thirdSegment && procedure.failure.gradient.thirdSegment.velocityIAS) {
        html = html.replace('{{#if thirdSegmentGradientRestriction}}', '');
        html = html.replace('{{/if thirdSegmentGradientRestriction}}', '');

        const height2Failure = aircraft?.profile.failure.heightSecondSegment.toFixed(2).toString() || '';

        html = html.replace('{{height2Failure}}', height2Failure.toString());

        const iasGradient3 = procedure?.failure.gradient.thirdSegment.velocityIAS.toFixed(2).toString();

        html = html.replace('{{iasGradient3}}', iasGradient3.toString());

        const tasGradient3 = procedure?.failure.gradient.thirdSegment.velocityTAS.toFixed(2).toString();

        html = html.replace('{{tasGradient3}}', tasGradient3.toString());

        const gradient3 = procedure?.failure.gradient.thirdSegment.rateClimb.toFixed(2).toString();

        html = html.replace('{{gradient3}}', gradient3.toString());

        if (procedure.failure.gradient.thirdSegment.clearDP) {
          var descGradient3 = '';
          if (procedure.failure.initialElevation > aircraft?.profile.failure.heightSecondSegment!) {
            descGradient3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - (${procedure.failure.distanceToInitial.toFixed(2)} + ${(procedure.failure.gradient.firstSegment.distanceToFinish ?? 0).toFixed(2)} + ${(procedure.failure.gradient.secondSegment.distanceToFinish ?? 0).toFixed(2)}) NM) / (${procedure.failure.gradient.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.gradient.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.gradient.thirdSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Y un gradiente de:</p>
              <p style="text-align: center;">
                gradiente = ((${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${procedure.failure.initialElevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
              </p>
              <p>Por lo tanto, sobrepasamos las restricciones.</p>
            `;
          } else {
            descGradient3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - (${procedure.failure.distanceToInitial.toFixed(2)} + ${(procedure.failure.gradient.firstSegment.distanceToFinish ?? 0).toFixed(2)} + ${(procedure.failure.gradient.secondSegment.distanceToFinish ?? 0).toFixed(2)}) NM) / (${procedure.failure.gradient.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.gradient.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.failure.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.failure.gradient.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
              </p>
              <p>Y un gradiente de:</p>
              <p style="text-align: center;">
                gradiente = ((${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.failure.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
              </p>
              <p>Por lo tanto, sobrepasamos las restricciones.</p>
            `;
          }
          html = html.replace('{{descGradient3}}', descGradient3.toString());
        } else {
          var descGradient3 = '';
          if (procedure.failure.initialElevation > aircraft?.profile.failure.heightSecondSegment!) {
            descGradient3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) / (${procedure.failure.gradient.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.gradient.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.gradient.thirdSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Y un gradiente de:</p>
              <p style="text-align: center;">
                gradiente = ((${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${procedure.failure.initialElevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
              </p>
              <p>Por lo tanto, no sobrepasamos las restricciones.</p>
            `;
          } else {
            descGradient3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.gradient.dpDistance.toFixed(2)} NM - (${procedure.failure.distanceToInitial.toFixed(2)} + ${(procedure.failure.gradient.firstSegment.distanceToFinish ?? 0).toFixed(2)} + ${(procedure.failure.gradient.secondSegment.distanceToFinish ?? 0).toFixed(2)}) NM) / (${procedure.failure.gradient.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.gradient.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.failure.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.failure.gradient.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
              </p>
              <p>Y un gradiente de:</p>
              <p style="text-align: center;">
                gradiente = ((${procedure.failure.gradient.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.failure.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft) / (${procedure.failure.gradient.dpDistance.toFixed(2)} NM * 6076.12 ft/NM)) * 100 = ${procedure.failure.gradient.finalGradient.toFixed(2)} %
              </p>
              <p>Por lo tanto, no sobrepasamos las restricciones.</p>
            `;
          }
          html = html.replace('{{descGradient3}}', descGradient3.toString());
        }

        const conclusionGradient = procedure?.procedureN1 || ''

        html = html.replace('{{conclusionGradient}}', conclusionGradient.toString());

      } else {
        html = html.replace(/{{#if thirdSegmentGradientRestriction}}[\s\S]*?{{\/if thirdSegmentGradientRestriction}}/g, '');
      }

    } else {
      html = html.replace(/{{#if gradientRestriction}}[\s\S]*?{{\/if gradientRestriction}}/g, '');
    }

    if (procedure.failure && procedure.failure.altitude && procedure.failure.altitude.state) {
      html = html.replace('{{#if altitudeRestriction}}', '');
      html = html.replace('{{/if altitudeRestriction}}', '');

      const distanceAltitudRestriction = procedure?.failure.altitude.dpDistance;

      html = html.replace('{{distanceAltitudRestriction}}', distanceAltitudRestriction.toFixed(2).toString());

      const altitudDPAltitudRestriction = procedure?.failure.altitude.dpElevation;

      html = html.replace('{{altitudDPAltitudRestriction}}', altitudDPAltitudRestriction.toFixed(2).toString());

      if (procedure.failure.altitude.firstSegment && procedure.failure.altitude.firstSegment.velocityIAS) {
        html = html.replace('{{#if firstSegmentAltitudeRestriction}}', '');
        html = html.replace('{{/if firstSegmentAltitudeRestriction}}', '');

        const height1Failure = aircraft?.profile.failure.heightFirstSegment.toFixed(2).toString() || '';

        html = html.replace('{{height1Failure}}', height1Failure.toString());

        const iasAltitudet1 = procedure?.failure.altitude.firstSegment.velocityIAS.toFixed(2).toString();

        html = html.replace('{{iasAltitudet1}}', iasAltitudet1.toString());

        const tasAltitudet1 = procedure?.failure.altitude.firstSegment.velocityTAS.toFixed(2).toString();

        html = html.replace('{{tasAltitudet1}}', tasAltitudet1.toString());

        const gradientAltitude1 = procedure?.failure.altitude.firstSegment.rateClimb.toFixed(2).toString();

        html = html.replace('{{gradientAltitude1}}', gradientAltitude1.toString());

        if (!procedure.failure.altitude.firstSegment.reachDP) {
          const descAltitude1 = 'Hasta terminar este segmento, recorremos una distancia de ' + procedure.failure.altitude.firstSegment.distanceToFinish.toFixed(2) +
                      ' NM. En este punto aún no hemos alcanzado la distancia.';
          html = html.replace('{{descAltitude1}}', descAltitude1.toString());
        } else {
          if (procedure.failure.altitude.firstSegment.clearDP) {
            const descAltitude1 = `
              <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.altitude.firstSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
              <p style="text-align: center;">
                h = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.altitude.firstSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.altitude.firstSegment.altitudeInDP.toFixed(2)}
              </p>
              <p>Por lo tanto hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${(procedure.failure.altitude.firstSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.altitude.firstSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Por lo tanto, sobrepasamos las restricciones.</p>
            `;
            html = html.replace('{{descAltitude1}}', descAltitude1.toString());
          } else {
            const descAltitude1 = `
              <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.altitude.firstSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
              <p style="text-align: center;">
                h = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.altitude.firstSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.altitude.firstSegment.altitudeInDP.toFixed(2)}
              </p>
              <p>Por lo tanto hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${(procedure.failure.altitude.firstSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.altitude.firstSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Por lo tanto, no sobrepasamos las restricciones.</p>
            `;
            html = html.replace('{{descAltitude1}}', descAltitude1.toString());
          }
        }

      } else {
        html = html.replace(/{{#if firstSegmentAltitudeRestriction}}[\s\S]*?{{\/if firstSegmentAltitudeRestriction}}/g, '');
      }

      if (procedure.failure.altitude.secondSegment && procedure.failure.altitude.secondSegment.velocityIAS) {
        html = html.replace('{{#if secondSegmentAltitudeRestriction}}', '');
        html = html.replace('{{/if secondSegmentAltitudeRestriction}}', '');

        const height1Failure = aircraft?.profile.failure.heightFirstSegment.toFixed(2).toString() || '';

        html = html.replace('{{height1Failure}}', height1Failure.toString());

        const height2Failure = aircraft?.profile.failure.heightSecondSegment.toFixed(2).toString() || '';

        html = html.replace('{{height2Failure}}', height2Failure.toString());

        const iasAltitude2 = procedure?.failure.altitude.secondSegment.velocityIAS.toFixed(2).toString();

        html = html.replace('{{iasAltitude2}}', iasAltitude2.toString());

        const tasAltitude2 = procedure?.failure.altitude.secondSegment.velocityTAS.toFixed(2).toString();

        html = html.replace('{{tasAltitude2}}', tasAltitude2.toString());

        const gradientAltitude2 = procedure?.failure.altitude.secondSegment.rateClimb.toFixed(2).toString();

        html = html.replace('{{gradientAltitude2}}', gradientAltitude2.toString());

        if (!procedure.failure.altitude.secondSegment.reachDP) {
          const descAltitude2 = 'Hasta terminar este segmento, recorremos una distancia de ' + procedure.failure.altitude.secondSegment.distanceToFinish.toFixed(2) +
                      ' NM. En este punto aún no hemos alcanzado la distancia.';
          html = html.replace('{{descAltitude2}}', descAltitude2.toString());
        } else {
          if (procedure.failure.altitude.secondSegment.clearDP) {
            var descAltitude2 = '';
            if (procedure.failure.initialElevation > aircraft?.profile.failure.heightFirstSegment!) {
              descAltitude2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.altitude.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.altitude.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.altitude.secondSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
                </p>
                <p>Por lo tanto, sobrepasamos las restricciones.</p>
              `;
            } else {
              descAltitude2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.altitude.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM - ${procedure.failure.altitude.firstSegment.distanceToFinish} NM) * 6076.12 ft/NM * ${(procedure.failure.altitude.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2))} ft + ${aircraft?.profile.failure.heightFirstSegment.toFixed(2)} ft + ${airport?.elevation!} ft = ${(procedure.failure.altitude.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
                </p>
                <p>Por lo tanto, sobrepasamos las restricciones.</p>
              `;
            }
            html = html.replace('{{descAltitude2}}', descAltitude2.toString());
          } else {
            var descAltitude2 = '';
            if (procedure.failure.initialElevation > aircraft?.profile.failure.heightFirstSegment!) {
              descAltitude2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.altitude.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) * 6076.12 ft/NM * ${(procedure.failure.altitude.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2))} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.altitude.secondSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
                </p>
                <p>Por lo tanto, no sobrepasamos las restricciones.</p>
              `;
            } else {
              descAltitude2 = `
                <p>Hasta terminar este segmento, recorremos una distancia de ${procedure.failure.altitude.secondSegment.distanceToFinish.toFixed(2)} NM. En este punto ya hemos alcanzado la distancia y hemos subido desde la distancia inicial: </p>
                <p style="text-align: center;">
                  h = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM - ${procedure.failure.altitude.firstSegment.distanceToFinish} NM) * 6076.12 ft/NM * ${(procedure.failure.altitude.secondSegment.rateClimb / 100).toFixed(2)} = ${procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2)}
                </p>
                <p>Por lo tanto hemos alcanzado una altitud de:</p>
                <p style="text-align: center;">
                  h = ${(procedure.failure.altitude.secondSegment.altitudeInDP.toFixed(2))} ft + ${aircraft?.profile.failure.heightFirstSegment.toFixed(2)} ft + ${airport?.elevation!} ft = ${(procedure.failure.altitude.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
                </p>
                <p>Por lo tanto, no sobrepasamos las restricciones.</p>
              `;
            }
            html = html.replace('{{descAltitude2}}', descAltitude2.toString());
          }
        }

      } else {
        html = html.replace(/{{#if secondSegmentAltitudeRestriction}}[\s\S]*?{{\/if secondSegmentAltitudeRestriction}}/g, '');
      }

      if (procedure.failure.altitude.thirdSegment && procedure.failure.altitude.thirdSegment.velocityIAS) {
        html = html.replace('{{#if thirdSegmentAltitudeRestriction}}', '');
        html = html.replace('{{/if thirdSegmentAltitudeRestriction}}', '');

        const height2Failure = aircraft?.profile.failure.heightSecondSegment.toFixed(2).toString() || '';

        html = html.replace('{{height2Failure}}', height2Failure.toString());

        const iasAltitude3 = procedure?.failure.altitude.thirdSegment.velocityIAS.toFixed(2).toString();

        html = html.replace('{{iasAltitude3}}', iasAltitude3.toString());

        const tasAltitude3 = procedure?.failure.altitude.thirdSegment.velocityTAS.toFixed(2).toString();

        html = html.replace('{{tasAltitude3}}', tasAltitude3.toString());

        const rocAltitude3 = procedure?.failure.altitude.thirdSegment.rateClimb.toFixed(2).toString();

        html = html.replace('{{rocAltitude3}}', rocAltitude3.toString());

        if (procedure.failure.altitude.thirdSegment.clearDP) {
          var descAltitude3 = '';
          if (procedure.failure.initialElevation > aircraft?.profile.failure.heightSecondSegment!) {
            descAltitude3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) / (${procedure.failure.altitude.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.altitude.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.altitude.thirdSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Por lo tanto, sobrepasamos las restricciones.</p>
            `;
          } else {
            descAltitude3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - (${procedure.failure.distanceToInitial.toFixed(2)} + ${procedure.failure.altitude.firstSegment.distanceToFinish ?? 0} + ${procedure.failure.altitude.secondSegment.distanceToFinish ?? 0}) NM) / (${procedure.failure.altitude.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.altitude.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.failure.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.failure.altitude.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
              </p>
              <p>Por lo tanto, sobrepasamos las restricciones.</p>
            `;
          }
          html = html.replace('{{descAltitude3}}', descAltitude3.toString());
        } else {
          var descAltitude3 = '';
          if (procedure.failure.initialElevation > aircraft?.profile.failure.heightSecondSegment!) {
            descAltitude3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.altitude.dpDistance.toFixed(2)} NM - ${procedure.failure.distanceToInitial.toFixed(2)} NM) / (${procedure.failure.altitude.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.altitude.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft + ${procedure.failure.initialElevation.toFixed(2)} ft = ${(procedure.failure.altitude.thirdSegment.altitudeInDP + procedure.failure.initialElevation).toFixed(2)} ft
              </p>
              <p>Por lo tanto, no sobrepasamos las restricciones.</p>
            `;
          } else {
            descAltitude3 = `
              <p>Tardamos en alcanzar la distancia: </p>
              <p style="text-align: center;">
                t = (${procedure.failure.altitude.dpDistance} NM - (${procedure.failure.distanceToInitial} + ${procedure.failure.altitude.firstSegment.distanceToFinish ?? 0} + ${procedure.failure.altitude.secondSegment.distanceToFinish ?? 0}) NM) / (${procedure.failure.altitude.thirdSegment.velocityTAS.toFixed(2)} NM/h / 60 min/h) = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min
              </p>
              <p>En este punto hemos subido desde el principio del segmento:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.timeToDP.toFixed(2)} min * ${procedure.failure.altitude.thirdSegment.rateClimb.toFixed(2)} ft/min = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft
              </p>
              <p>Por lo tanto, hemos alcanzado una altitud de:</p>
              <p style="text-align: center;">
                h = ${procedure.failure.altitude.thirdSegment.altitudeInDP.toFixed(2)} ft + ${aircraft?.profile.failure.heightSecondSegment.toFixed(2)} ft + ${airport?.elevation.toFixed(2)} ft = ${(procedure.failure.altitude.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.failure.heightSecondSegment!).toFixed(2)} ft
              </p>
              <p>Por lo tanto, no sobrepasamos las restricciones.</p>
            `;
          }
          html = html.replace('{{descAltitude3}}', descAltitude3.toString());
        }

      } else {
        html = html.replace(/{{#if thirdSegmentAltitudeRestriction}}[\s\S]*?{{\/if thirdSegmentAltitudeRestriction}}/g, '');
      }

      const conclusionAltitude = procedure?.procedureN1 || ''

      html = html.replace('{{conclusionAltitude}}', conclusionAltitude.toString());

    } else {
      html = html.replace(/{{#if altitudeRestriction}}[\s\S]*?{{\/if altitudeRestriction}}/g, '');
    }

    const conclusionN1 = procedure?.procedureN || ''
    const formattedConclusionN1 = conclusionN1.replace(/\n/g, '<br>');

    html = html.replace('{{conclusionN1}}', formattedConclusionN1.toString());

    combinedHtml += `<div style="page-break-after: always;">${html}</div>`;
  }

  console.log('CREATED HTML')

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',  // Usar menos memoria compartida
      '--disable-gpu',  // Deshabilitar GPU, ya que no es necesaria para un entorno sin interfaz gráfica
      '--disable-software-rasterizer',
      '--no-zygote',
      '--single-process',
    ],
    headless: true,
  });

  console.log('LAUNCHED BROWSER: ')

  let page: any;

  try {
    console.log(browser);
    console.log(browser.isConnected());
    const pages = await browser.pages();
    console.log('Existing pages:', pages);
    page = await browser.newPage();
    console.log('NEW PAGE');
    console.log(page);
  } catch (error) {
    console.error('Error creating new page:', error);
  }


  await page.setContent(combinedHtml, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  });

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  await browser.close();

}

export { generatePdfList };
