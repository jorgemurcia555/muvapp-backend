import { Request, Response } from "express";
import { Dni, DniModel } from "./../models/Dni";
import { User, UserModel } from "./../models/User";
import { Error } from "mongoose";

export const saveDni = (req: Request & any, res: Response) => {
    const { front, back } = req.body;
    const newDni = new Dni();
    newDni.frontDni = front;
    newDni.backDni = back;

    newDni
    .save()
    .then((dni:DniModel) => {
        User.updateOne({_id: req.payload.user._id}, {userDni: dni})
        .exec()
        .then((user: UserModel) => {
            res.status(200).send(user).end()
        }).catch((error: Error) => {
            res.status(500).send({ error, msj: "server_error" }).end()
        })

    }).catch((error: Error) => {
        res.status(500).send({ error, msj: "server_error" }).end()
    })
}

export const getDni = (req:Request & any, res:Response ) => {
    const { id } = req.params.id;

    Dni
    .findById(id)
    .exec()
    .then((dniResult: DniModel) => {
        res.status(200).json(dniResult).end();
    })
    .catch((error: Error) => {
        res.status(500).json({error, msj: 'Server Error'}).end();
    })
}