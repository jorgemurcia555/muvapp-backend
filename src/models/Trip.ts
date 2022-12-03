import mongoose from "mongoose";
import { Schema } from "mongoose";
import { UserModel } from "./User";
import { CompanyModel } from "./Company";
const AutoIncrement = require("mongoose-sequence")(mongoose);

interface Form {
  customer: UserModel | string;
  telephone: string;
  email: string;
  code: string;
  image: string;
  template: string;
  fulldate: string;
  description: string;
  barcode: string;
  address: Address;

}


export interface Timeline {
  fulldate: string;
  address?: Address;
  status: string;
  image?: string;
  description?: string;
  user: string;

}

interface Address {
  name: string;
  url: string;
  id: string;
  lng: number;
  lat: number;
}


const address = new Schema({
  name: String,
  url: String,
  id: String,
  lng: Number,
  lat: Number,
}, { _id: false });

const form = new Schema({
  description: String,
  barcode: String,
  code: String,
  email: String,
  fulldate: String,
  telephone: String,
  address: address,
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { _id : false });


const timeline = new Schema({
  description: String,
  fulldate: String,
  image: String,
  address: { type: Object, ref: "Address" },
  status: { type: String, enum: ["Creado", "Actualizado", "Admitido", "Comenzado", "Cancelado", "Fallido", "Finalizado"], default: "Creado"},
  user: { type: Schema.Types.ObjectId, ref: "User" },
}, { _id : false });

export type TripModel = mongoose.Document & {
  finalStatus: string;
  status: string;
  type: string;
  assign: string;
  route: number;
  time: any;
  markers: any[];
  pickUp: Form[];
  agents: UserModel[];
  timeline: Timeline[];
  company: CompanyModel;
};


const TripSchema = new mongoose.Schema<TripModel>({
  code: { type: Number, default: 1},
  finalStatus: String,
  assign: { type: String, enum: ["Manual", "Automatico"], default: "Automatico"},
  type: { type: String, enum: ["Recogida y Entrega", "Viaje"]},
  route: Number,
  time: Object,
  markers: [Array],
  pickUp: [form],
  timeline: [timeline],
  status: { type: String, enum: ["Sin asignar", "Asignado", "En progreso", "Cancelado", "Fallido", "Completado"], default: "Sin asignar"},
  company: { type: Schema.Types.ObjectId, ref: "Company", required: [true, "Company is required for trip"] },
  agents: [{ type: Schema.Types.ObjectId, ref: "User", required: [false, "Agent is not required"] }],
}, { timestamps: true });

TripSchema.plugin(AutoIncrement, { id: "trip_code", inc_field: "code", reference_fields: ["company"] });
export const Trip = mongoose.model<TripModel>("Trip", TripSchema);