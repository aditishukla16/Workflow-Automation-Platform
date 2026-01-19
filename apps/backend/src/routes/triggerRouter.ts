import { Router } from "express";
import { createAvailableTrigger, getAvailableTriggersById, updateAvailableTriggers } from "../controller/trigger";


const router = Router();

router.post("/create", createAvailableTrigger);

router.get("/:id",getAvailableTriggersById);

router.get("/",getAvailableTriggersById);

router.put("/:id",updateAvailableTriggers);

export const triggerRouter = router