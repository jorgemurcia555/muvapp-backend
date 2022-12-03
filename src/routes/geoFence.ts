import { Router } from "express";
import { createGeoFence, getGeoFences, getGeoFence, removeGeoFence, geoFenceUpdate } from "../controllers/geoFence";

const GeoFenceRouter = Router();

GeoFenceRouter.post("/new", createGeoFence);
GeoFenceRouter.get("/list", getGeoFences);
GeoFenceRouter.delete("/:id", removeGeoFence);
GeoFenceRouter.get("/:id", getGeoFence);
GeoFenceRouter.put("/:id", geoFenceUpdate);

export default GeoFenceRouter;