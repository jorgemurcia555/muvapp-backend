import { Router } from "express";
import {
    admitTrip,
    startTrip,
    finishTrip,
    createTrip,
    getTrips,
    getTripsToday,
    getTripByStatus,
    getTrip,
    removeTrip,
    tripUpdate,
    getCoutByStatus,
    getFilteredTrips,
    getTripsMobile,
    getPerAgent,
    expoToken,
    tripMessage,
    testIO,
    newTrip,
    getAllTrips,
    getTripsAgent,
    newTripAgent,
    updateAssingAgent,
    addClient
} from "../controllers/trip";

const TripRouter = Router();

TripRouter.post("/new", createTrip);
TripRouter.post("/new-trip-agent", newTripAgent);
TripRouter.post("/new-trip", newTrip);

TripRouter.get("/list-trip-agent", getTripsAgent);
TripRouter.get("/list-all", getAllTrips);
TripRouter.get("/test-io", testIO);
TripRouter.get("/list", getTrips);
TripRouter.get("/list-filtered", getFilteredTrips);
TripRouter.get("/list-mobile", getTripsMobile);
TripRouter.get("/list-today", getTripsToday);
TripRouter.get("/list-per-agent", getPerAgent);
TripRouter.get("/list-per-status/:status", getTripByStatus);
TripRouter.get("/count-per-status", getCoutByStatus);
TripRouter.get("/:id", getTrip);

TripRouter.put("/assing-agent/:id", updateAssingAgent)
TripRouter.put("/add-client", addClient)
TripRouter.put("/expo-token", expoToken);
TripRouter.put("/expo-message", tripMessage);

// * Para agentes y admin
TripRouter.put("/admit/:id", admitTrip);
TripRouter.put("/start/:id", startTrip);
TripRouter.put("/finish/:id", finishTrip);

// * Solo para ADMIN
TripRouter.put("/:id", tripUpdate);


TripRouter.delete("/:id", removeTrip);

export default TripRouter;