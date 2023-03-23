import {createTransport} from './../controllers/transport';
import { Router } from 'express'

const TransportRouter = Router();

TransportRouter.post('/createNew', createTransport)

export default TransportRouter;