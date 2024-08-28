import { Router } from "express";
import { generatePdfCtrl } from "../controllers/pdf.controller";

const router = Router();

router.post('/generate/:id', generatePdfCtrl);

export { router };