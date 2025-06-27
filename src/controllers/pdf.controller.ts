import { Request, Response } from "express";
import path from "path";
import { generateCrewProcedurePdf, generatePdfList } from "../services/pdf.service";
import { Procedure } from "../interfaces/procedure.interface";
import { obtainProcedure } from "../services/procedure.service";
import cloudinary from "cloudinary";
import fs from "fs";
import { obtainCrewProcedure } from "../services/crewProcedure.service";
import logger from "../config/logger";

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const generatePdfCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = await obtainProcedure(id);

        if (data) {
            const procedure = data;
            const templatePath = path.resolve(__dirname, '../templates/operations/Procedure.html');
            const outputPath = path.resolve(__dirname, '../outputs', `output_${Date.now()}.pdf`);

            try {
                await generatePdfList([procedure], templatePath, outputPath);
                logger.info(`PDF generated locally for procedure id: ${id}`);

                cloudinary.v2.uploader.upload(outputPath, { resource_type: 'raw' }, (error, result) => {
                    if (error) {
                        logger.error(`Cloudinary upload failed for procedure id ${id}: ${error}`);
                        return res.status(500).send('Error uploading PDF to Cloudinary: ' + error);
                    }
                    fs.unlink(outputPath, (unlinkError) => {
                        if (unlinkError) {
                            logger.error(`Error deleting local file after upload (id ${id}): ${unlinkError}`);
                        }
                    });
                    logger.info(`PDF uploaded to Cloudinary for procedure id ${id}`);
                    res.status(200).json({ url: result?.secure_url });
                });
            } catch (error: any) {
                logger.error(`Error generating PDF for procedure id ${id}: ${error.stack || error}`);
                res.status(500).send('Error generating PDF ' + error);
            }
        } else {
            logger.info(`Procedure not found with id: ${id}`);
            res.status(404).send('Procedure not found');
        }
    } catch (e: any) {
        logger.error(`Unhandled error in generatePdfCtrl: ${e.stack || e}`);
        res.status(500).json(`Error getUser: ${e}`);
    }
};

const generateCombinedPdfCtrl = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            logger.info('Empty or invalid procedure ID list received');
            return res.status(400).send('Invalid request: Procedure IDs are required.');
        }

        const procedures = await Promise.all(ids.map(async (id) => {
            const data = await obtainProcedure(id);
            if (data) {
                return data as Procedure;
            }
            logger.info(`Procedure with id ${id} not found`);
            return null;
        }));

        const validProcedures = procedures.filter((proc): proc is Procedure => proc !== null);

        if (validProcedures.length === 0) {
            logger.info('No valid procedures found in request');
            return res.status(404).send('No valid procedures found.');
        }

        const outputDirectory = path.resolve(__dirname, '../outputs');
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        const templatePath = path.resolve(__dirname, '../templates/operations/Procedure.html');
        const outputPath = path.resolve(outputDirectory, `output_combined_${Date.now()}.pdf`);

        try {
            await generatePdfList(validProcedures, templatePath, outputPath);
            logger.info(`Combined PDF generated for ${validProcedures.length} procedures`);

            cloudinary.v2.uploader.upload(outputPath, { resource_type: 'raw' }, (error, result) => {
                if (error) {
                    logger.error(`Cloudinary upload failed for combined PDF: ${error}`);
                    return res.status(500).send('Error uploading PDF to Cloudinary: ' + error);
                }
                fs.unlink(outputPath, (unlinkError) => {
                    if (unlinkError) {
                        logger.error(`Error deleting combined local PDF: ${unlinkError}`);
                    }
                });
                logger.info(`Combined PDF uploaded to Cloudinary`);
                res.status(200).json({ url: result?.secure_url });
            });
        } catch (error: any) {
            logger.error(`Error generating combined PDF: ${error.stack || error}`);
            res.status(500).send('Error generating combined PDF: ' + error);
        }
    } catch (e: any) {
        logger.error(`Unhandled error in generateCombinedPdfCtrl: ${e.stack || e}`);
        res.status(500).json(`Error generateCombinedPdfCtrl: ${e}`);
    }
};

const generateCrewProcedureCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = await obtainCrewProcedure(id);

        if (data) {
            const crewProcedure = data;
            const outputDirectory = path.resolve(__dirname, '../outputs');
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory, { recursive: true });
            }

            const outputPath = path.resolve(outputDirectory, `output_combined_${Date.now()}.pdf`);

            try {
                await generateCrewProcedurePdf(crewProcedure, outputPath);
                logger.info(`Crew PDF generated locally for id: ${id}`);

                cloudinary.v2.uploader.upload(outputPath, { resource_type: 'raw' }, (error, result) => {
                    if (error) {
                        logger.error(`Cloudinary upload failed for crew procedure id ${id}: ${error}`);
                        return res.status(500).send('Error uploading PDF to Cloudinary: ' + error);
                    }
                    fs.unlink(outputPath, (unlinkError) => {
                        if (unlinkError) {
                            logger.error(`Error deleting local file for crew procedure id ${id}: ${unlinkError}`);
                        }
                    });
                    logger.info(`Crew PDF uploaded to Cloudinary for id ${id}`);
                    res.status(200).json({ url: result?.secure_url });
                });
            } catch (error: any) {
                logger.error(`Error generating crew PDF for id ${id}: ${error.stack || error}`);
                res.status(500).send('Error generating combined PDF: ' + error);
            }
        } else {
            logger.info(`Crew procedure not found with id: ${id}`);
            res.status(404).send('Crew Procedure Not Found');
        }
    } catch (e: any) {
        logger.error(`Unhandled error in generateCrewProcedureCtrl: ${e.stack || e}`);
        res.status(500).json(`Error generateCombinedPdfCtrl: ${e}`);
    }
};

export { generatePdfCtrl, generateCombinedPdfCtrl, generateCrewProcedureCtrl };
