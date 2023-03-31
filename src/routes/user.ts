import {getMyTrips} from './../controllers/user';
import { Router } from "express";
import { registerAgent } from "../controllers/auth";
import {
    getUsersPerType,
    createManager,
    createAgent,
    getAddress,
    createCustomer,
    updateUser,
    changeAgentStatus,
    createRoot,
    getUser,
    getUsersPerTeam,
    getTransports
} from "../controllers/user";

const UserRouter = Router();
UserRouter.post("/new-root", createRoot);
UserRouter.post("/new-manager", createManager);
UserRouter.post("/new-agent", registerAgent);
UserRouter.post("/new-customer", createCustomer);
UserRouter.get("/list-trips", getMyTrips);
UserRouter.get("/list-transports", getTransports);
UserRouter.get("/list-address", getAddress);
UserRouter.get("/list-per-type/:type", getUsersPerType);
UserRouter.get("/list-per-team/:id/:type", getUsersPerTeam);
UserRouter.get("/:id", getUser);
UserRouter.put("/change-agent-status/:id", changeAgentStatus);
UserRouter.put("/:id", updateUser);

export default UserRouter;