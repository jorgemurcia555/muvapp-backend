import mongoose from "mongoose";
import { Schema } from "mongoose";


export type CompanyModel = mongoose.Document & {
    name: string,
    address: string,
    email: string,
    rtn: string,
    telephone: string,
    enabled: boolean,
};

export const companySchema = new Schema<CompanyModel>({
  name: String,
  address: String,
  email: String,
  rtn: String,
  telephone: String,
  enabled: { type: Boolean, default: true },
}, { timestamps: true });

export const Company = mongoose.model<CompanyModel>("Company", companySchema);
