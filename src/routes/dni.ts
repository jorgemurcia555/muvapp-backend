import { saveDni, getDni } from './../controllers/dni';
import { Router } from "express";

const DniRouter = Router();

DniRouter.post('/new', saveDni);
DniRouter.get('/:id', getDni);

export default DniRouter;