import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/User";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env-dev" });

export const isAuth = (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      console.log(req.headers.authorization.split(" ")[1]);
        return res.send(req.headers.authorization.split(" ")[1]);
    } else if (req.query && req.query.token) {
        console.log(req.query.token);
      return res.send(req.query.token);
    }
    return undefined;
};
export const logout = (req: Request, res: Response, next: NextFunction) => {

    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } 

    if (!token) {
        return res.status(401).json({ error: "token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(400).json({ error: "token invalid" });
    }

};
/* export const hasRole = (role) => (req: Request, res: Response, next: NextFunction) => {
    if (req.user === role) {
        return next();
    }

    res.sendStatus(403);
} */