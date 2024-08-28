import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { Procedure } from '../interfaces/procedure.interface';
import { Aircraft } from '../interfaces/aircraft.interface';
import { obtainAircraft } from './aircraft.service';
import { Airport } from '../interfaces/airport.interface';
import { obtainAirport } from './airport.service';

const generatePdf = async (procedure: Procedure, templatePath: string, outputPath: string) => {
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

    const rateN1 = procedure?.nMotors.firstSegment.rateClimb || ''

    html = html.replace('{{rateN1}}', rateN1.toFixed(2).toString());
  } else {
    html = html.replace(/{{#if firstSegmentN}}[\s\S]*?{{\/if firstSegmentN}}/g, '');
  }

  if (procedure.nMotors.firstSegment.reachDP == false) {
    const descN1 = 'Tardamos en recorrer este primer segmento ' + procedure.nMotors.firstSegment.timeToFinish.toFixed(2) +
                ' minutos y recorremos una distancia de ' + procedure.nMotors.firstSegment.distanceToFinish.toFixed(2) +
                ' NM. En este punto aún no hemos alcanzado el DP.';
    html = html.replace('{{descN1}}', descN1.toString());
  } else {
    if (procedure.nMotors.firstSegment.clearDP == true) {
      const descN1 = 'Tardamos en recorrer este primer segmento ' + procedure.nMotors.firstSegment.timeToFinish.toFixed(2) +
                ' minutos y recorremos una distancia de ' + procedure.nMotors.firstSegment.distanceToFinish.toFixed(2) +
                ' NM. En este punto ya hemos alcanzado el DP y hemos alcanzado un altitud de ' +
                (procedure.nMotors.firstSegment.altitudeInDP + airport?.elevation!).toFixed(2) +
                ' ft. Por lo tanto, sobrepasamos los obstáculos.';
      html = html.replace('{{descN1}}', descN1.toString());
    } else {
      const descN1 = 'Tardamos en recorrer este primer segmento ' + procedure.nMotors.firstSegment.timeToFinish.toFixed(2) +
                ' minutos y recorremos una distancia de ' + procedure.nMotors.firstSegment.distanceToFinish.toFixed(2) +
                ' NM. En este punto ya hemos alcanzado el DP y hemos alcanzado un altitud en el DP de ' +
                (procedure.nMotors.firstSegment.altitudeInDP + airport?.elevation!).toFixed(2) +
                ' ft. Por lo tanto, no sobrepasamos los obstáculos.';
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

    const rateN2 = procedure?.nMotors.secondSegment.rateClimb || ''

    html = html.replace('{{rateN2}}', rateN2.toFixed(2).toString());

    if (!procedure.nMotors.secondSegment.reachDP) {
      const descN2 = 'Tardamos en recorrer este segundo segmento ' + procedure.nMotors.secondSegment.timeToFinish.toFixed(2) +
                  ' minutos y recorremos una distancia de ' + procedure.nMotors.secondSegment.distanceToFinish.toFixed(2) +
                  ' NM. En este punto aún no hemos alcanzado el DP.';
      html = html.replace('{{descN2}}', descN2.toString());
    } else {
      if (procedure.nMotors.secondSegment.clearDP) {
        const descN2 = 'Tardamos en recorrer este segundo segmento ' + procedure.nMotors.secondSegment.timeToFinish.toFixed(2) +
                  ' minutos y recorremos una distancia de ' + procedure.nMotors.secondSegment.distanceToFinish.toFixed(2) +
                  ' NM. En este punto ya hemos alcanzado el DP y hemos alcanzado un altitud en el DP de ' +
                  (procedure.nMotors.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightFirstSegment!).toFixed(2) +
                  ' ft. Por lo tanto, sobrepasamos los obstáculos.';
        html = html.replace('{{descN2}}', descN2.toString());
      } else {
        const descN2 = 'Tardamos en recorrer este segundo segmento ' + procedure.nMotors.secondSegment.timeToFinish.toFixed(2) +
                  ' minutos y recorremos una distancia de ' + procedure.nMotors.secondSegment.distanceToFinish.toFixed(2) +
                  ' NM. En este punto ya hemos alcanzado el DP y hemos alcanzado un altitud de ' +
                  (procedure.nMotors.secondSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightFirstSegment!).toFixed(2) +
                  ' ft. Por lo tanto, no sobrepasamos los obstáculos.';
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

    const rateN3 = procedure?.nMotors.thirdSegment.rateClimb || ''

    html = html.replace('{{rateN3}}', rateN3.toFixed(2).toString());

    if (procedure.nMotors.thirdSegment.clearDP) {
      const descN3 = 'Tardamos en alcanzar el DP ' + procedure.nMotors.thirdSegment.timeToDP.toFixed(2) +
                ' minutos. En este punto hemos alcanzado un altitud en el DP de ' +
                (procedure.nMotors.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightSecondSegment!).toFixed(2) +
                ' ft. Por lo tanto, sobrepasamos los obstáculos.';
      html = html.replace('{{descN3}}', descN3.toString());
    } else {
      const descN3 = 'Tardamos en alcanzar el DP ' + procedure.nMotors.thirdSegment.timeToDP.toFixed(2) +
                ' minutos. En este punto hemos alcanzado un altitud en el DP de ' +
                (procedure.nMotors.thirdSegment.altitudeInDP + airport?.elevation! + aircraft?.profile.nMotors.heightSecondSegment!).toFixed(2) +
                ' ft. Por lo tanto, no sobrepasamos los obstáculos.';
      html = html.replace('{{descN3}}', descN3.toString());
    }
  } else {
    html = html.replace(/{{#if thirdSegmentN}}[\s\S]*?{{\/if thirdSegmentN}}/g, '');
  }

  const conclusionN1 = procedure?.procedureN || ''

  html = html.replace('{{conclusionN1}}', conclusionN1.toString());

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

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
};

export { generatePdf };
