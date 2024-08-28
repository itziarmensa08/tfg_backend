import { Request, Response } from "express";
import path from 'path';
import { generatePdf } from "../services/pdf.service";
import { Procedure } from "../interfaces/procedure.interface";
import { obtainProcedure } from "../services/procedure.service";
import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
    cloud_name: 'duvdq4fkz',
    api_key: '568359618655378',
    api_secret: 'Z84WWqnyvixvKUFfeqhLom8RuFg'
});


const generatePdfCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        let data: any = await obtainProcedure(id);
        let procedure : Procedure;
        if (data) {
            procedure = data;
            const templatePath = path.resolve(__dirname, '../templates/operations/Procedure.html');
            const outputPath = path.resolve(__dirname, '../outputs', `output_${Date.now()}.pdf`);

            try {
                await generatePdf(procedure, templatePath, outputPath);
                cloudinary.v2.uploader.upload(outputPath, { resource_type: 'raw' }, (error, result) => {
                    if (error) {
                        return res.status(500).send('Error uploading PDF to Cloudinary: ' + error);
                    }
                    fs.unlink(outputPath, (unlinkError) => {
                        if (unlinkError) {
                            console.error('Error deleting local PDF file: ', unlinkError);
                        }
                    });
                    res.status(200).json({ url: result?.secure_url });
                });
            } catch (error) {
                res.status(500).send('Error generating PDF ' + error);
            }
        } else {
            res.status(404).send('Procedure not found');
        }
    } catch (e) {
        res.status(500).json(`Error getUser: ${e}`)
    }
}

export { generatePdfCtrl }