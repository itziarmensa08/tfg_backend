import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const generatePdf = async (data: any, templatePath: string, outputPath: string) => {
  // Leer la plantilla HTML
  let html = fs.readFileSync(templatePath, 'utf-8');

  // Reemplazar los marcadores de posición con los datos reales
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key]);
  });

  // Crear un navegador de Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Establecer el contenido de la página con el HTML modificado
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generar el PDF con formato A4 y orientación vertical
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

  // Cerrar el navegador
  await browser.close();
};

export { generatePdf };
