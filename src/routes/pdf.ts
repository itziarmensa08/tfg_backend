import { Router } from "express";
import { generateCombinedPdfCtrl, generatePdfCtrl, generateCrewProcedureCtrl } from "../controllers/pdf.controller";

const router = Router();

router.post('/generate/:id', generatePdfCtrl);

router.post('/generate', generateCombinedPdfCtrl);

router.post('/generate/crewProcedure/:id', generateCrewProcedureCtrl);

export { router };