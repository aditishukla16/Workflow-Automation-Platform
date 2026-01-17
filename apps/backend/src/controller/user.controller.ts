import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const Signup = async (req:Request, res:Response)=>{
    try{
        const {name,email, password}= req.body;
         
        if(!name || !email ||!password){
            return res.status(400).json({
                message:"All fields are required",
            })
        }
        const existingUser = await prisma.user.findUnique({
            where:{email}
        })
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
    
        const user = await prisma.user.create({
             data:{
                name,
                email,
                password:hashedPassword
                
            }
        })
        res.status(201).json({
            message:"User created successfully",user
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            message:"internal server error",
            error:err
        })
    }
};

export const signin = async (req:Request, res:Response)=> {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and password are required"
            })
        }
        const user = await prisma.user.findUnique({
            where:{email}
        });
        if(!user){
         return res.status(401).json({
            message: "Invalid email or password"
         });
        }
        const isPasswordValid = await bcrypt.compare(
            password,user.password
        );
        if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
        return res.status(200).json({
          message:"logged in successfully",
          user:{
            id:user.id,
            email:user.email
          }  
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}