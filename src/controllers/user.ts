import { Request, Response } from "express";
import { Error } from "mongoose";
import winston from "winston";
import crypto from "crypto";

import { default as UserType, UserTypeModel } from "../models/UserType";
import { User, UserModel } from "./../models/User";

import * as helpers from "../helpers/password";
import { getIOConnection } from "../helpers/io";

const mongoose = require("mongoose");
export const createRoot = (req: Request & any, res: Response) => {
    User
        .findOne({ email: req.body.email })
        .exec()
        .then(async (user) => {
            if (user) {
                throw new Error("duplicated_email");
            }
            const rootStatus = await UserType.find({type: 0}).exec();
            if (rootStatus.length > 0) {
                return res.status(500).json({message: "Ya existe un usuario root"});
            } else {
                const userType = new UserType();
                userType.type = 0;
                userType.role = "Manager";
                return userType.save();
            }
        })
        .then(async (userType: UserTypeModel) => {
            const user = new User(req.body);
            user.password = await helpers.encryptPassword(req.body.password);
            user.userType = userType;
            // user.status.status = "Libre";
            return user.save();
        })
        .then((user) => {
            winston.info("/users/generateRootUser", { status: 200 });
            return res.json(user).status(200).end();
        })
        .catch((err: Error) => {
            winston.error("/users/generateRootUser", { status: 500, error: err.message, body: req.body });
            return res.json({ error: "server_error" }).status(500).end();
        });
};
export const createManager = (req: Request & any, res: Response) => {
    User
        .findOne({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user) {
                throw new Error("duplicated_email");
            }
            const userType = new UserType();
            userType.type = 1;
            userType.role = "Manager";
            return userType.save();
        })
        .then(async (userType: UserTypeModel) => {
            const user = new User(req.body);
            const company = req.payload.user.company;
            user.company = company;
            user.password = await helpers.encryptPassword(req.body.password);
            user.userType = userType;
            // user.status.status = "Libre";
            return user.save();
        })
        .then((user) => {
            winston.info("/users/generateManagerUser", { status: 200 });
            return res.json(user).status(200).end();
        })
        .catch((err: Error) => {
            winston.error("/users/generateManagerUser", { status: 500, error: err.message, body: req.body });
            return res.json({ error: "server_error" }).status(500).end();
        });
};
// * Create agent
export const createAgent = (req: Request & any, res: Response) => {
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
            
                User.create({
                    email:email,
                    password: encryptPassword,
                    salt: newSalt,
                    userType: userType,
                }).then((user) => {
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
export const createCustomer = (req: Request & any, res: Response) => {
    User
        .findOne({ email: req.body.email })
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
        .then(async (userType: UserTypeModel) => {
            const user = new User(req.body);
            const company = req.payload.user.company;
            user.company = company;
            user.password = await helpers.encryptPassword(req.body.password);
            user.userType = userType;
            return user.save();
        })
        .then((user) => {
            winston.info("/users/generateCustomerUser", { status: 200 });
            return res.json(user).status(200).end();
        })
        .catch((err: Error) => {
            winston.error("/users/generateCustomerUser", { status: 500, error: err.message, body: req.body });
            return res.json({ error: "server_error" }).status(500).end();
        });
};

export const getUser = (req: Request & any, res: Response) => {
    const id = req.params.id;
    User
        .findOne({_id: id})
        .populate("userType")
        .populate("userDni")
        .populate("userLicence")
        .populate({
            path: "address",
            populate: { path: "address"}
        })
        .exec()
        .then((user: UserModel) => {
            res.status(200).json(user);
        })
        .catch((err: any) => {
            res.status(500).json({ message: "Error al devolver usuarios por tipos", err: err });
        });
};
export const getUsersPerType = (req: Request & any, res: Response) => {
    const type = Number(req.params.type);
    const company = req.payload.user.company;
    User
        .find({ company })
        .populate("userType")
        .populate({
            path: "teams",
            populate: { path: "teams" }
        })
        .exec()
        .then((users: UserModel[]) => {
            const usersFilter = users.filter(u => u.userType.type === type);
            res.status(200).json(usersFilter);
        })
        .catch((err: any) => {
            res.status(500).json({ message: "Error al devolver usuarios por tipos", err: err });
        });
};
export const getUsersPerTeam = (req: Request & any, res: Response) => {
    const team = req.params.id;
    const type = Number(req.params.type);
    console.log("query", team, type);
    const company = req.payload.user.company;
    User
        // .find({teams: { $in: [team]}, "status.status": {$in: ["Libre"]} })
        .find({teams: { $in: [team]}, status: "Libre", company })
        .populate("userType")
        // .populate("team")
        .exec()
        .then((users: UserModel[]) => {
            const usersFilter = users.filter(u => u.userType.type === type);
            res.status(200).json(usersFilter);
        })
        .catch((err: any) => {
            res.status(500).json({ message: "Error al devolver usuarios por tipos", err: err });
        });
};

export const updateUser = (req: Response & any, res: Response) => {
    const user = new mongoose.Types.ObjectId(req.params.id);
    const updateFields = req.body;

    User
        .updateOne({ _id: user }, updateFields, { new: true })
        .exec()
        .then((user: UserModel) => {
            res.status(200).json( user );
        })
        .catch((err: any) => {
            return res.status(500).json({ error: err, message: "Error al editar usuario" }).end();
        });
};

export const changeAgentStatus = (req: Request & any, res: Response ) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const io = getIOConnection();
    const status = req.body;
    // ToDo restringir si el agente esta 'ocupado';
    User
        .updateOne({ _id: id }, status, { new: true})
        .exec()
        .then((results) => {
            io.emit("updatedAgent", "success");
            res.status(200);
        })
        .catch((err) => res.status(500).json({err, message: "Error al cambiar estado del agente"}));
};


export const getAddress = (req: Request & any, res: Response) => {

    User
        .findOne({_id: req.payload.user._id})
        .populate({
            path: "address",
            populate: { path: "address"}
        })
        .then((user: UserModel) => {
            res.status(200).json(user.address);
        })
        .catch((err: any) => {
            res.status(500).json({ message: "Error al obtener las direcciones del usuario", err: err });
        });
}

export const getTransports = (req: Request & any, res: Response) => {

    User
        .findOne({_id: req.payload.user._id})
        .populate({
            path: "vehicle",
            populate: { path: "vehicle"}
        })
        .then((user: UserModel) => {
            res.status(200).json(user.vehicle);
        })
        .catch((err: any) => {
            res.status(500).json({ message: "Error al obtener los transportes del usuario", err: err });
        });
}