import * as dotenv from "dotenv";
import { ErrorRequestHandler } from "express";

const mongoose = require("mongoose");
const bluebird = require("bluebird");

dotenv.config({ path: ".env-dev" });

const mongoUrl = process.env[`MONGO_URL_${process.env.STAGE}`];

mongoose.Promise = bluebird;
mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } )
    .then(() => {
        console.log("\n-------------------------------------------------------");
        console.log(`MONGODB CONNECTION SUCCESS TO '${process.env.MONGO_DB_NAME}' DB`);
        console.log("--------------------------------------------------------\n");
    })
    .catch(() => {
        console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log("MONGODB CONNECTION ERROR. Please make sure MongoDB is running.");
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");
    });

/* UserType
    .findOne({type: 0})
    .exec(result => {
        if (!result) {
            const newUser: UserModel = {
                {
                    firstName: 'muvex',
                }
            }
            User.
        }
    }); */
