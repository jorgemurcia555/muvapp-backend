
import { Request, Response } from "express";
import { Error } from "mongoose";
import * as winston from "winston";

import { default as UserType, UserTypeModel } from "../models/UserType";

export const get = (req: Request & any, res: Response) => {

    const conditions: any = { company: req.payload.user._id };
    if (req.payload.user.userType.type === 0) {
        conditions.enabled = true;
    }

    UserType.find(conditions)
        .exec()
        .then(categories => res.status(200).json(categories))
        .catch((err: Error) => {
            winston.error(req.path, { body: req.body, headers: req.headers, error: err.message });
            return res.status(500).json({ error: "error_querying_categories" });
        });
};
export const add = (req: Request & any, res: Response) => {
    const userType = new UserType(req.body.userType) as UserTypeModel;

    const error: any = userType.validateSync();

    if (error) {
        const json: any = {};

        if (error.errors.color) {
            json.color = error.errors.color.message;
        }

        if (error.errors.description) {
            json.description = error.errors.description.message;
        }

        winston.error(req.path, { body: req.body, headers: req.headers, error });
        return res.status(400).json(json);
    }

    // TODO: Response success should not depend on whether we were able to
    // notify the users or not
    userType.save()
        .then((_userType: UserTypeModel) => {
            res.status(200).json(_userType);
        })
        .catch((err: Error) => {
            winston.error(req.path, { body: req.body, headers: req.headers, error: err.message });
            return res.status(500).json({ error: "server_error" });
        });
};

export const remove = (req: Request & any, res: Response) => {

    const user = req.payload.user;
    if (user.userType.type !== 0) {
        winston.error(req.path, { body: req.body, headers: req.headers, error: "User is not admin or trying to delete a userType from another company" });
        return res.status(401).json({ error: "unauthorized_action_for_role" });
    }

    req.userType.enabled = false;
    return req.userType.save()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((userType: UserTypeModel) => {
            res.status(200).end();

        })
        .catch((err: Error) => {
            winston.error(req.path, { body: req.body, headers: req.headers, error: err.message });
            return res.status(500).json({ error: "server_error" });
        });
};
export const update = (req: Request, res: Response) => {
    const userType = req.body.userType;

    const updateFields: any = {};

    if (userType.description) {
        updateFields.description = userType.description;
    }

    if (userType.color) {
        updateFields.color = userType.color;
    }

    UserType.update({ _id: userType._id }, updateFields, { new: true })
        .exec()
        .then((userType: UserTypeModel) => {
            res.status(200).json(userType);
        })
        .catch((err) => {
            winston.error(req.path, { body: req.body, headers: req.headers, error: err.message });
            if (err.name === "ValidationError") {
                return res.status(400).end();
            }
            return res.status(500).json({ error: "server_error" }).end();
        });
};


