import { Request, Response } from "express";
import path from 'path';
import { generatePdf } from "../services/pdf.service";


const generatePdfCtrl = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const templatePath = path.resolve(__dirname, '../templates/operations/Procedure.html');
        console.log(templatePath)
        const outputPath = path.resolve(__dirname, '../outputs', `output_${Date.now()}.pdf`);

        try {
            await generatePdf(data, templatePath, outputPath);
            res.download(outputPath);
        } catch (error) {
            res.status(500).send('Error generating PDF');
        }
    } catch (e) {
        res.status(500).json(`Error getUser: ${e}`)
    }
}

export { generatePdfCtrl }