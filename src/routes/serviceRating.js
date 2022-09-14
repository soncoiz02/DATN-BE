import { Router } from "express";
import { createServeRating, listServeRating, readServeRating, removeServeRating, updateServeRating } from "../controllers/serviceRating";



const route = Router();


route.post("/service-rating", createServeRating);
route.get("/service-rating", listServeRating);
route.delete("/service-rating/:id", readServeRating);
route.put("/service-rating/:id", removeServeRating);
route.get("/service-rating/:id", updateServeRating);


export default route;