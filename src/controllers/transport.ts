import { TransportModel, Transport } from './../models/Transport';
import { User, UserModel } from './../models/User';
import { Error } from 'mongoose';
import { Request, Response } from 'express';
const mongoose = require('mongoose');


export const createTransport = (req: Request & any, res: Response) => {
    const { brand, model, color, license_plate, spots, additionals, observations, img } = req.body

    const newTransport = new Transport();

    newTransport.brand = brand
    newTransport.model = model
    newTransport.color = color
    newTransport.license_plate = license_plate
    newTransport.spots = spots
    newTransport.additionals = additionals
    newTransport.observations = observations
    newTransport.img = img


    newTransport
    .save()
    .then( (transportResult: TransportModel) => {
        const idTransport = new mongoose.Types.ObjectId(transportResult._id)

        User
        .updateOne({ _id: new mongoose.Types.ObjectId(req.payload.user._id)}, { $push: { vehicle: [idTransport]} })
        .then((userUpdate: UserModel) => {
            res.status(200).send(userUpdate).end();
        })
        .catch((error: Error) =>{
            res.status(500).json({error, msj: 'Server error user'}).end()
        })
    })

}
