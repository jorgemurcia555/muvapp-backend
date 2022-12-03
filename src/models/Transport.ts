
import { Document, model, Schema } from "mongoose";

export type TransportModel = Document & {
    type: string,
    spots: {
        seats: number,
        trunk: number,
        bodywork: number,
    },
    brand: string,
    model: string,
    color: string,
    license_plate: string,
    observations: string,
    enabled: boolean,
};

const TransportSchema = new Schema<TransportModel>({
    type: String,
    spots: Object,
    brand: String,
    model: String,
    color: String,
    license_plate: String,
    observations: String,
    enabled: { type: Boolean, default: true },
}, { timestamps: true });

const Transport = model<TransportModel>("Transport", TransportSchema);

export default Transport;
