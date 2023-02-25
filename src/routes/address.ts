import { createAddress } from './../controllers/address';
import { Router } from "express";

const AddressRouter = Router();

AddressRouter.post('/new', createAddress);


export default AddressRouter;