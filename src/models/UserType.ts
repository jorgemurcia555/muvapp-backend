
import { Document, model, Schema } from "mongoose";

export type UserTypeModel = Document & {
    role: string,
    enabled: boolean,
    type: number,
    enableRouters: string[],
};
/* enum type:
    * 0: root
    * 1: manager
    * 2: agent
    * 3: client
*/
const userTypeSchema = new Schema({
    type: { type: Number, required: true, default: 0, enum: [0, 1, 2, 3] },
    role: { type: String, enum: ["Root", "Manager", "Agent", "Customer"], default: "Customer" },
    enabled: { type: Boolean, default: true },
    enableRouters: { type: [String], default: ["*"] }
}, { timestamps: true });

const UserType = model<UserTypeModel>("UserType", userTypeSchema);

export default UserType;
