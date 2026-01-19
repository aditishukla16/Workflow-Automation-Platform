import { Router } from "express";
import { Request,Response } from "express";
import { createCredentials, deleteCredentials, getCredentials, getCredentialsById, updateCredentials } from "../controller/credential.controller";

const router = Router();

router.post("/create",createCredentials)
router.get("/",getCredentials) 
router.get("/:id",getCredentialsById)
router.put("/:id",updateCredentials)
router.delete("/:id",deleteCredentials)

export const credentialRouter = router;