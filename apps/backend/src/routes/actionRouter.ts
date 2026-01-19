import { Router } from "express";
import { createAvailableAction, getAvailableActionById, getAvailableActions, updateAvailableAction} from "../controller/action.controller";


const router = Router()

router.post("/create",createAvailableAction);

router.get("/:id",getAvailableActionById);

router.get("/",getAvailableActions);

router.put("/:id",updateAvailableAction);    
    
export const actionRouter = router   