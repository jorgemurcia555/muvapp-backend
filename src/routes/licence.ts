import { saveLicence, getLicence } from './../controllers/licence';
import { Router } from "express";


const LicenceRouter = Router();

LicenceRouter.post('/new', saveLicence);
LicenceRouter.get('/:id', getLicence);
export default LicenceRouter;
