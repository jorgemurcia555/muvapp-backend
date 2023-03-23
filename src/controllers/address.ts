import { User, UserModel } from './../models/User';
import { Address, AddressModel } from './../models/Address';
import { Request, Response } from 'express';
import { Error } from 'mongoose';

const mongoose = require('mongoose');

export const createAddress = (req: Request & any, res: Response) => {
    const { name, referenceSignal, type, lng, lat } = req.body ;
    // console.dir(req.body);
    
    const newAddress = new Address();
    newAddress.name = name;
    newAddress.referenceSignal = referenceSignal;
    newAddress.type = type;
    newAddress.lng = lng;
    newAddress.lat = lat;

    newAddress
    .save()
    .then( (addressResult: AddressModel) => {
        // console.log(address._id);
        const idAddress = new mongoose.Types.ObjectId(addressResult._id)
        User
        .updateOne({_id: new mongoose.Types.ObjectId(req.payload.user._id)},{$push: { address: [idAddress]}})
        .then((userUpdate: UserModel) => {
            res.status(200).send(userUpdate).end();
        })
        .catch((error: Error) =>{
            res.status(500).json({error, msj: 'Server error user'}).end()
        })
    })
    .catch((error: Error) =>{
        res.status(500).json({error, msj: 'Server error address'}).end()
    })
    
}

export const updateState = (req: Request, res: Response) => {
    const { id } = req.params;
    
    Address.updateOne({_id: id}, { enabled: false })
    .exec()
    .then((addressResult:AddressModel) => {
        res.status(200).send(addressResult).end();
    })
    .catch((error: Error) => {
        res.status(500).json({error, msj: 'Server error address'}).end();
    })

}
