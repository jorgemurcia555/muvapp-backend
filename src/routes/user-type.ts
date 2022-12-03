import { Router, Response, NextFunction } from "express";
import { get, add, remove, update } from "../controllers/user-type";
import { default as UserType, UserTypeModel } from "../models/UserType";
const UserTypeRouter = Router();

UserTypeRouter.param("userType", (req: any, res: Response, next: NextFunction, id) => {

    const query = UserType.findById(id);
    query.exec((err: any, userType: UserTypeModel) => {
        if (err) return next(err);
        if (!userType) return next(new Error("Cannot find userType"));

        req.userType = userType;

        return next();
    });
});

UserTypeRouter.delete("/:userType", remove);
UserTypeRouter.put("/", update);
UserTypeRouter.get("/", get);
UserTypeRouter.post("/", add);

export default UserTypeRouter;