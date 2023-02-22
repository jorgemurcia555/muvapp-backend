
import { Document, model, Schema } from "mongoose";

export type AddressModel = Document & {
    type: string;
    category: string;
    enabled: boolean;
    name: string;
    url: string;
    lng: number;
    lat: number;
};

const AddressSchema = new Schema<AddressModel>({
    type: String,
    category: String,
    name: String,
    url: String,
    lng: Number,
    lat: Number,
    enabled: { type: Boolean, default: true },
}, { timestamps: true });

const Address = model<AddressModel>("Address", AddressSchema);

export default Address;
