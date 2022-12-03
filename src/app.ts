import compression from "compression";
import cors from "cors";
import express from "express";
import expressJwt from "express-jwt";
import indexRouter from "./routes/index";
import logger from "morgan";
import passport from "passport";
import path from "path";
import * as dotenv from "dotenv";
// import serverless from "serverless-http";

import "./config/passport";
import "./config/database";

const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const { isAuth } = require("./auth");


// * ----------------------- Intializations -----------------------
dotenv.config({ path: ".env-dev" });
app.get("env-dev");
app.use(
  express.static(path.join(__dirname, "/public"), { maxAge: 31557600000 })
);

// * ----------------------- Middlewares -----------------------
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(compression());
app.use(logger("dev"));


// * ----------------------- Config -----------------------
app.set("port", process.env.SERVER_PORT || 3000);
app.set("view engine", "pug");

const jwtOptions: any = {
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    userProperty: "payload",
    getToken: (req: { headers: { authorization: string; }; query: { token: any; }; }): any => {
      if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return undefined;
    }
};

app.use("/", expressJwt(jwtOptions).unless({ 
  path: ["/api/auth/login"]}), async (err: any, req: any, res: any, next: any): Promise<any> => {
    const root = "/api";
    const excluded = [`${root}/auth/login`,
      `${root}/users/new-root`,
      "/socket.io/socket.io.js",
      "/socket.io",
      "socket.io",
      `${root}/auth/register-agent`,
      `${root}/auth/token`,
      `${root}/auth/logout`,
      `${root}/auth/login-mobile`,
      `${root}/companies/new`
    ];
    if (excluded.indexOf(req.url) > -1) return next();
    res.status(401).json(err);
});

/* app.use("/", expressJwt(jwtOptions).unless({ path: [
  "/api/v0/auth/login",
  "/api/v0/users/new-root",
  "/api/v0/socket.io/socket.io.js",
  "/api/v0/auth/register-agent",
  "/api/v0/auth/login-mobile"
] })); */
// * ----------------------- Router -----------------------
app.use("/api", indexRouter);

export default app;
