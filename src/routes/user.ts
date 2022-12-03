import { Router } from "express";
import { registerAgent } from "../controllers/auth";
import {
    getUsersPerType,
    createManager,
    createAgent,
    createCustomer,
    updateUser,
    changeAgentStatus,
    createRoot,
    getUser,
    getUsersPerTeam
} from "../controllers/user";

const UserRouter = Router();
UserRouter.post("/new-root", createRoot);
UserRouter.post("/new-manager", createManager);
UserRouter.post("/new-agent", registerAgent);
UserRouter.post("/new-customer", createCustomer);
UserRouter.get("/list-per-type/:type", getUsersPerType);
UserRouter.get("/list-per-team/:id/:type", getUsersPerTeam);
UserRouter.get("/:id", getUser);
UserRouter.put("/change-agent-status/:id", changeAgentStatus);
UserRouter.put("/:id", updateUser);

export default UserRouter;