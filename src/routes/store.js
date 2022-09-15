import { Router } from "express";
import { createStore, deleteStore, listStore, storeDetail, updateStore } from "../controllers/store";

const router = Router()

router.post("/store",createStore)
router.get("/store",listStore)
router.get("/store/:id",storeDetail)
router.delete("/store/:id",deleteStore)
router.put("/store/:id",updateStore)

export default router