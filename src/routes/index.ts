import { Router } from "express";
import AuthRouter from "./auth";
import CompanyRouter from "./companies";
import GeoFenceRouter from "./geoFence";
import UserRouter from "./user";
import UserTypeRouter from "./user-type";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/users-type", UserTypeRouter);
router.use("/geo-fence", GeoFenceRouter);
router.use("/companies", CompanyRouter);
export = router;
