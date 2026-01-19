import { Router } from "express";
import { Request,Response } from "express";
import { signin, Signup } from "../controller/user.controller";


const router = Router()
router.post("/signup",Signup)
router.post("/signin",signin)

export const userRouter = router