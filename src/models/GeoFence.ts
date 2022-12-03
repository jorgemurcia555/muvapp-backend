import mongoose from "mongoose";
import { Schema } from "mongoose";
import { CompanyModel } from "./Company";

type PolygonModel = mongoose.Document & {
  lng: number,
  lat: number,
};

const polygonSchema = new Schema<PolygonModel> ({
  lng: Number,
  lat: Number,
}, { _id : false });
export type GeoFenceModel = mongoose.Document & {
  name: string;
  description: string;
  enabled: boolean;
  company: CompanyModel;
  areas: [PolygonModel[]];
};

const teamSchema = new Schema<GeoFenceModel>({
  name: String,
  description: String,
  enabled: { type: Boolean, default: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: [true, "Company is required for geo fence"] },
  areas: [[polygonSchema]]
}, { timestamps: true });

export const GeoFence = mongoose.model<GeoFenceModel>("GeoFence", teamSchema);