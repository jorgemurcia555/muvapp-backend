import { NextFunction, Request, Response } from "express";
import * as _ from "lodash";
import { Company, CompanyModel } from "./../models/Company";

export const createCompany = (req: Request & any, res: Response): void => {
    const company = new Company(req.body);
    company
        .save()
        .then((company: CompanyModel) => res.json(company).end())
        .catch((err: Error) => {
            return res.status(500).json({ error: err });
        });
};
