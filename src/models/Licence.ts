import mongoose from "mongoose";
import { Schema } from "mongoose";


export type LicenceModel = mongoose.Document & {
    frontLicence: string,
    backLicence: string
};


export const licenceSchema = new Schema<LicenceModel>({
    frontLicence: {type: String, require: [true, 'El elemento es requerido']},
    backLicence: {type: String, require: [true, 'El elemento es requerido']}
}, { timestamps: true })

export const Licence = mongoose.model<LicenceModel>("Licence", licenceSchema);