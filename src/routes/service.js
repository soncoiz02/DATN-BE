import { Router } from "express";
import { creat } from "../controllers/service";



const route = Router();


route.post("/service", creat);




export default route;