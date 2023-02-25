import { User, UserModel } from './../models/User';
import { Address, AddressModel } from './../models/Address';
import { Request, Response } from 'express';
import { Error } from 'mongoose';

const mongoose = require('mongoose');

export const createAddress = (req: Request & any, res: Response) => {
    const { name } = req.body ;
    console.log(req.payload.user._id);
    
    const newAddress = new Address();
    newAddress.name = name;

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

