import { Router } from "express";
import { createServeRating, listServeRating, readServeRating, removeServeRating, updateServeRating } from "../controllers/serviceRating";



const route = Router();


route.post("/service-rating", createServeRating);
route.get("/service-rating", listServeRating);
route.get("/service-rating/:id", readServeRating);
route.delete("/service-rating/:id", removeServeRating);
route.put("/service-rating/:id", updateServeRating);


export default route;