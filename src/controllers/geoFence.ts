import { GeoFence, GeoFenceModel } from "./../models/GeoFence";
import { NextFunction, Request, Response } from "express";
import winston from "winston";

export const createGeoFence = (req: Request & any, res: Response): void => {
    const geoFence = new GeoFence(req.body);
    const company = req.payload.user.company;
    geoFence.company = company;
    geoFence
      .save()
      .then((geoFence: GeoFenceModel) => res.json(geoFence).end())
      .catch((err: Error) => {
        return res.status(500).json({ error: err });
      });
};

export const getGeoFences = (req: Request & any, res: Response): void => {
    const company = req.payload.user.company;
    GeoFence
        .find({ company, enabled: true })
        .exec()
        .then((geoFences: GeoFenceModel[]) => res.json(geoFences).end())
        .catch((err: Error) => {
            res.status(500).json({ error: err });
        });
};

export const getGeoFence = (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params.id;
    GeoFence
        .findById(id)
        .exec()
        .then((geoFence: GeoFenceModel) => {
            res.status(200).send({ geoFence });
        })
        .catch((err: Error) => {
            winston.error(req.path, { body: req.body, headers: req.headers, error: err.message });
            if (err) { return next(err); }
            return res.status(500).json({ error: "server_error" }).end();
        });
};
export const removeGeoFence = (req: Request, res: Response, next: NextFunction): void => {

    GeoFence.remove({ _id: req.params.id }, (err) => {
        if (err) { return next(err); }
        res.status(200).send({ response: "Registro eliminado" });
    });

};
export const geoFenceUpdate = (req: Request, res: Response): void => {

    const geoFence = req.params;
    const updateFields = req.body;

    GeoFence
        .updateOne({ _id: geoFence.id }, updateFields, { new: true })
        .exec()
        .then((doc: GeoFenceModel) => {
            res.status(200).json( doc );
        })
        .catch((err: Error) => {
            winston.error(req.path, { body: req.body, headers: req.headers, error: err.message });
            if (err.name === "ValidationError") {
                return res.status(400).end();
            }
            return res.status(500).json({ error: "server_error" }).end();
        });
};
