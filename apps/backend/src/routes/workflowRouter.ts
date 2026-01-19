import { Router } from "express";
import { Request,Response } from "express";
import { createWorkflow, getWorkflowById, getWorkflows, updateWorkflow } from "../controller/workflow.controller";


const router = Router();

router.post("/create",createWorkflow)

router.get("/",getWorkflows)

router.get("/:id", getWorkflowById)

router.put("/:id",updateWorkflow)

export const workflowRouter = router