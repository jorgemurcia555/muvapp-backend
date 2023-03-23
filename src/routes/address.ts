import {createAddress, updateState} from './../controllers/address';
import { Router } from "express";

const AddressRouter = Router();

AddressRouter.post('/new', createAddress);
AddressRouter.put('/state/:id', updateState);


export default AddressRouter;