import { Licence, LicenceModel } from './../models/Licence';
import { User, UserModel } from './../models/User';
import { Error } from "mongoose";
import { Request, Response } from 'express';


export const saveLicence = (req: Request & any, res: Response ) => {

    const {front, back} = req.body

    const newLicence = new Licence();
    newLicence.frontLicence = front;
    newLicence.backLicence = back;

    newLicence
    .save()
    .then((licence: LicenceModel) => {
        User.updateOne({_id:req.payload.user._id}, {userLicence: licence})
        .then((user: UserModel) => {
            res.status(200).send(user).end()
        }).catch((error: Error) => {
            res.status(500).send({error, msj: 'Server error'}).end()
        })
    })
    .catch((error: Error) => {
        res.status(500).send({error, msj: 'Server error'}).end()
    })

}

export const getLicence = (req: Request & any, res: Response ) => {
    const { id } = req.params;

    Licence
    .findById(id)
    .exec()
    .then((licenceResult: LicenceModel) => {
        res.status(200).json(licenceResult).end();
    })
    .catch((error:Error) => {
        res.status(500).json({error, msj:'Server Error'}).end();
    })

}