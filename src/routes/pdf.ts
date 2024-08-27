import { Router } from "express";
import { generatePdfCtrl } from "../controllers/pdf.controller";

const router = Router();

router.post('/generate', generatePdfCtrl);

export { router };