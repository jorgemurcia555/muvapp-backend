import { Router } from "express";
import { createCompany } from "../controllers/company";

const CompanyRouter = Router();

CompanyRouter.post("/new", createCompany);
export default CompanyRouter;
