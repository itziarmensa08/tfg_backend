import { Request, Response } from "express";
import path from 'path';
import { generatePdfList } from "../services/pdf.service";
import { Procedure } from "../interfaces/procedure.interface";
import { obtainProcedure } from "../services/procedure.service";
import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
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
                await generatePdfList([procedure], templatePath, outputPath);
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

const generateCombinedPdfCtrl = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send('Invalid request: Procedure IDs are required.');
        }

        const procedures: (Procedure | null)[] = await Promise.all(ids.map(async (id) => {
            const data: any = await obtainProcedure(id);
            if (data) {
                return data as Procedure;
            }
            return null;
        }));

        const validProcedures: Procedure[] = procedures.filter((proc): proc is Procedure => proc !== null);

        if (validProcedures.length === 0) {
            return res.status(404).send('No valid procedures found.');
        }

        const outputDirectory = path.resolve(__dirname, '../outputs');
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        const templatePath = path.resolve(__dirname, '../templates/operations/Procedure.html');
        const outputPath = path.resolve(__dirname, '../outputs', `output_combined_${Date.now()}.pdf`);

        try {
            await generatePdfList(validProcedures, templatePath, outputPath);
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
            res.status(500).send('Error generating combined PDF: ' + error);
        }
    } catch (e) {
        res.status(500).json(`Error generateCombinedPdfCtrl: ${e}`);
    }
};

export { generatePdfCtrl, generateCombinedPdfCtrl }