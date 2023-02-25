import { Router } from "express";
import AuthRouter from "./auth";
import CompanyRouter from "./companies";
import GeoFenceRouter from "./geoFence";
import UserRouter from "./user";
import UserTypeRouter from "./user-type";
import TripRouter from "./trip";
import DniRouter from "./dni";
import LicenceRouter from "./licence";
import AddressRouter from "./address";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/users-type", UserTypeRouter);
router.use("/geo-fence", GeoFenceRouter);
router.use("/companies", CompanyRouter);
router.use("/trip", TripRouter);
router.use("/dni", DniRouter);
router.use("/licence", LicenceRouter);
router.use("/address", AddressRouter);
export = router;
