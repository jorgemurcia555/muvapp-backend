import { UserTypeModel } from "./UserType";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { CompanyModel } from "./Company";
import { LicenceModel } from "./Licence";
import { DniModel } from "./Dni";
interface Preferences {
  timezone: string;
  intro: boolean;
  language: string;
}

export type UserStatusModel = mongoose.Document & {
  status: string;
}

const userStatusSchema = new mongoose.Schema<UserStatusModel>({
  status: { type: String, enum: ["Libre", "Ocupado", "Inactivo"], default: "Libre"},
}, { timestamps: { createdAt: false, updatedAt: true }, _id: false });

export type VehicleModel = mongoose.Document & {
  type: string;
  description: string;
  registration: string;
}
export type UserModel = mongoose.Document & {
  firstName: string,
  image: string,
  lastName: string,
  address: [any],
  enabled: boolean,
  deviceToken: string,
  preferences: {
    timezone: string,
    intro: boolean,
    language: string
  },
  userType: UserTypeModel,
  userLicence: LicenceModel,
  userDni: DniModel,
  hash: string,
  appCode: string,
  telephone: string,
  email: string,
  password: string,
  salt: string,
  activeSession: Boolean,
  authData: {
    facebookId: string,
    accessToken: string,
    exp: Date,
  },
  profile: {
      name: string,
      gender: string,
      location: string,
      website: string,
      picture: string,
  },
  passwordResetToken: string,
  passwordResetExpires: Date,

  facebook: string,
  tokens: AuthToken[],
  intro: boolean,
  // status: UserStatusModel;
  status: string;
  trips: [any],
  vehicle: [any],
  company: CompanyModel,
};

export interface AuthToken {
    accessToken: string;
    kind: string;
}


const userSchema = new mongoose.Schema<UserModel>({
  firstName: String,
  lastName: String,
  address: [{ type:  Schema.Types.ObjectId, ref: "Address" }],
  image: String,
  deviceToken: { type: String, required: false },
  enabled: { type: Boolean, default: true },
  appCode: { type: String, match: [new RegExp("[a-z0-9]{5}"), "appCode doesn't match a valid pattern"], required: [false, "appCode is required for user"] },
  userType: { type: Schema.Types.ObjectId, ref: "UserType", required: [true, "User type is required for user"] },
  userLicence: { type: Schema.Types.ObjectId, ref: "Licence"},
  userDni: { type: Schema.Types.ObjectId, ref: "Dni"},
  preferences: {
    timezone: { type: String, default: "America/Tegucigalpa" },
    allCustomers: { type: Boolean, default: false },
    language: { type: String, default: "en" },
    intro: { type: Boolean, default: true }
  },
  telephone: { type: String, required: true},
  email: { type: String, lowercase: true, unique: true, required: false },
  hash: String,
  password: String,
  salt: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  activeSession: { type: Boolean, default: false },
  facebook: String,
  twitter: String,
  google: String,
  tokens: Array,

  profile: {
      name: String,
      gender: String,
      location: String,
      website: String,
      picture: String
  },
  trips: [{ type:  Schema.Types.ObjectId, ref: "Trip" }],
  vehicle: [{ type:  Schema.Types.ObjectId, ref: "Transport" }],
  // status: userStatusSchema,
  status: { type: String, enum: ["Libre", "Ocupado", "Inactivo"], default: "Libre"},
  company: { type: Schema.Types.ObjectId, ref: "Company", required: [true, "Company is required for template"] },
}, { timestamps: true });

export const User = mongoose.model<UserModel>("User", userSchema);
