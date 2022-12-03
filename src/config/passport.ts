import passport from "passport";
import passportLocal from "passport-local";
import { NativeError } from "mongoose";

import { User, UserModel } from "../models/User";
import * as helpers from "../helpers/password";

const localStrategy = passportLocal.Strategy;

// * Passport for login
passport.use("local.signin", new localStrategy((email, password, done) => {
    User
        .findOne({ email: email.toLowerCase() })
        .populate({
            path: "teams",
            populate: "teams"
        })
        .populate("userType")
        .exec(async (err, user) => {
            if (err) return done(err);
            if (!user) return done(undefined, false, { message: `Email ${email} not found.` });
            if (!user.enabled || user.userType.role !== "Manager") return done(undefined, false, { message: "restricted access"});
            const validPassword = await helpers.matchPassword( password, user.password);
            return validPassword ? done(undefined, user) : done(undefined, false, { message: "Invalid password." });
        });
}));

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: NativeError, user: UserModel) => {
        done(err, user.id);
    });
});
