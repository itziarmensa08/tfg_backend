import { Router } from "express";
import { generateCombinedPdfCtrl, generatePdfCtrl } from "../controllers/pdf.controller";

const router = Router();

router.post('/generate/:id', generatePdfCtrl);

router.post('/generate', generateCombinedPdfCtrl);

export { router };