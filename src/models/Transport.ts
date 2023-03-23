
import { Document, model, Schema } from "mongoose";

export type TransportModel = Document & {
    type: string,
    brand: string,
    model: string,
    color: string,
    license_plate: string,
    spots: {
        seats: number,
        trunk: number,
        bodywork: number,
    },
    additionals: string,
    observations: string,
    img:string,
    enabled: boolean,
};

const TransportSchema = new Schema<TransportModel>({
    brand: String,
    model: String,
    color: String,
    license_plate: String,
    spots: Object,
    additionals: String,
    observations: String,
    img: String,
    type: String,
    enabled: { type: Boolean, default: true },
}, { timestamps: true });

export const Transport = model<TransportModel>("Transport", TransportSchema);

// export default Transport;
