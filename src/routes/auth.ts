import { Router } from "express";
import { login, loginMobile, registerAgent, logout } from "../controllers/auth";
import { isAuth } from "../auth";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/login-mobile", loginMobile);
AuthRouter.post("/register-agent", registerAgent);
AuthRouter.get("/token", isAuth);
AuthRouter.post("/logout", logout);
export default AuthRouter;
