
import { Document, model, Schema } from "mongoose";
const mongoose = require("mongoose");


export type AddressModel = Document & {
    type: string;
    referenceSignal: string;
    enabled: boolean;
    name: string;
    url: string;
    lng: number;
    lat: number;
};

const AddressSchema = new Schema<AddressModel>({
    type: { type: String, default: true },
    referenceSignal: { type: String, default: true },
    name: { type: String, default: true },
    url: String,
    lng: { type: mongoose.Types.Decimal128, default: true },
    lat: { type: mongoose.Types.Decimal128, default: true },
    enabled: { type: Boolean, default: true },
}, { timestamps: true });

export const Address = model<AddressModel>("Address", AddressSchema);
