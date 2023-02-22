import mongoose from "mongoose";
import { Schema } from "mongoose";
import { UserModel } from "./User";
import { CompanyModel } from "./Company";
import { TransportModel } from "./Transport";
import { AddressModel } from "./Address";

const AutoIncrement = require("mongoose-sequence")(mongoose);

export interface Timeline {
  fulldate: string;
  address?: AddressModel;
  status: string;
  image?: string;
  description?: string;
  user: string;

}

const timeline = new Schema({
  description: String,
  fulldate: String,
  image: String,
  address: { type: Object, ref: "Address" },
  status: { type: String, enum: ["Creado", "Actualizado", "Admitido", "Comenzado", "Cancelado", "Fallido", "Finalizado"], default: "Creado"},
  user: { type: Schema.Types.ObjectId, ref: "User" },
}, { _id : false });

export type TripModel = mongoose.Document & {
  code: number;
  status: string;
  type: string;
  time: any;
  markers: any[];
  spots: number;
  price: number;
  addressA:AddressModel;
  addressB:AddressModel;
  distance: number;
  user: UserModel;
  vehicle: TransportModel;
  date: string;
  timeline: Timeline[];
  company: CompanyModel;
};


const TripSchema = new mongoose.Schema<TripModel>({
  code: { type: Number, default: 1},
  status: { type: String, enum: ["Sin asignar", "Asignado", "En progreso", "Cancelado", "Fallido", "Completado"], default: "Sin asignar"},
  type: { type: String, enum: ["Hogar","Oficina", "Otro"]},
  time: Object,
  markers: [Array],
  spots: Number,
  price: Number,
  addressA: { type: Schema.Types.ObjectId, ref: "Address", required: [false, "Address is required for trip"] },
  addressB: { type: Schema.Types.ObjectId, ref: "Address", required: [false, "Address is required for trip"] },
  distance: Number,
  date: String,
  vehicle: {type: Schema.Types.ObjectId, ref: "Transport", required: [false, "Transport is required for trip"]},
  timeline: [timeline],
  company: { type: Schema.Types.ObjectId, ref: "Company", required: [true, "Company is required for trip"] },
  user: { type: Schema.Types.ObjectId, ref: "User", required: [false, "Agent is not required"] },
}, { timestamps: true });

TripSchema.plugin(AutoIncrement, { id: "trip_code", inc_field: "code", reference_fields: ["company"] });
export const Trip = mongoose.model<TripModel>("Trip", TripSchema);