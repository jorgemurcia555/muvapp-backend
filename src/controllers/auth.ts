import passport from "passport";
import { User, UserModel } from "../models/User";
import { default as UserType, UserTypeModel } from "../models/UserType";
import crypto from "crypto";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config({ path: ".env-dev" });

import { Request, Response, NextFunction } from "express";
// const jwt = require("jsonwebtoken");
import winston from "winston";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
/* 
    const token = req.headers.authorization;
    if(!token) {
        res.sendStatus(403);
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        const _id = decoded;
        User.findOne({ _id }).exec()
            .then(user => {
                req.user = user;
                console.log(req.user);
                next();
            });
    }); */
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
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
export const    login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local.signin", (err: any, user: UserModel, info: any) => {
        if (err) {
            winston.error("/users/login", { error: err });
            return next(err);
        }

        if (!user) {
            winston.error("/users/login", { status: 401, error: info });
            return res.status(401).json(info);
        }
        const token = jwt.sign({user: user}, process.env.SECRET_KEY, {expiresIn: process.env.TOKEN_EXPIRES_IN});
        return res.status(200).json({user, token: token});
    })(req, res, next);

};
export const loginMobile = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    User.findOne({ email })
    .exec()
    .then(user => {
        if (!user) {
            return res.send("Usuario o contraseña incorrecta");
        }
        user.image = ''
        crypto.pbkdf2(password, user.salt, 10000, 64, "sha1", (err, key) => {
            const encryptPassword = key.toString("base64");
            const signToken = (user: any) => {
                return jwt.sign({user}, process.env.SECRET_KEY, {
                    expiresIn: process.env.TOKEN_EXPIRES_IN
                });
            };
            if (user.password === encryptPassword) {
                const token = signToken(user);
                return res.send({ user, token });
            }
            return res.send("Usuario o contraseña incorrecta");
        });
    });
};
export const registerCustomer = (req: Request & any, res: Response) => {
    const { email, password } = req.body;

    crypto.randomBytes(16, ( err: Error, salt ) => {
        const newSalt = salt.toString("base64");
        crypto.pbkdf2(password, newSalt, 10000, 64, "sha1", (err, key) => {
            const encryptPassword = key.toString("base64");
            User.findOne({ email })
            .exec()
            .then((user) => {

                if (user) {
                    throw new Error("duplicated_email");
                }
                const userType = new UserType();
                userType.type = 3;
                userType.role = "Customer";
                return userType.save();

            })
            .then((userType: UserTypeModel) => {
            
                User.create({
                    email:email,
                    password: encryptPassword,
                    salt: newSalt,
                    userType: userType,
                }).then((user) => {
                    winston.info("/users/generateCustomerUser", { status: 200 });
                    return res.json(user).status(200).end(); 
                });
            })
            .catch((err: Error) => {

            winston.error("/users/generateCustomerUser", { status: 500, error: err.message, body: req.body });
            return res.json({ error: "server_error" }).status(500).end();

        });
        });
    });
};

export const registerAgent = (req: Request & any, res: Response) => {
    const { email, password } = req.body;

    crypto.randomBytes(16, ( err: Error, salt ) => {
        const newSalt = salt.toString("base64");
        crypto.pbkdf2(password, newSalt, 10000, 64, "sha1", (err, key) => {
            const encryptPassword = key.toString("base64");
            User.findOne({ email })
            .exec()
            .then((user) => {

                if (user) {
                    throw new Error("duplicated_email");
                }
                const userType = new UserType();
                userType.type = 2;
                userType.role = "Agent";
                return userType.save();

            })
            .then((userType: UserTypeModel) => {
                // const company = req.payload.user.company;
                const user = Object.assign(req.body, {
                    email:email,
                    password: encryptPassword,
                    salt: newSalt,
                    userType: userType,
                    // company
                });
                User.create(user).then((user) => {
                    winston.info("/users/generateAgentUser", { status: 200 });
                    return res.json(user).status(200).end(); 
                });
            })
            .catch((err: Error) => {

            winston.error("/users/generateAgentUser", { status: 500, error: err.message, body: req.body });
            return res.send("server_error");
        });
        });
    });
};


