import mongoose from "mongoose";
import { Schema } from "mongoose";


export type DniModel = mongoose.Document & {
    frontDni: string,
    backDni: string,
};

export const dniSchema = new Schema<DniModel>({
    frontDni: {type: String, require: [true, 'El elemento es requerido']},
    backDni: {type: String, require: [true, 'El elemento es requerido']}
}, { timestamps: true })

export const Dni = mongoose.model<DniModel>("Dni", dniSchema);