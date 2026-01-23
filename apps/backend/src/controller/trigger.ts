import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";

//CREATE
export const createAvailableTrigger = async(req:Request,res:Response)=> {
 try {
    const {name, type, icon} = req.body;

    if(!name || !type) {
        return res.status(400).json({
        message:"name and type are required"
        });
    }
    const trigger = await prisma.availableTrigger.create({
        data:{
            name,
            type,
            icon,
        }
    });
    res.status(201).json({
        message:"Trigger created successfully",
        trigger,
    });

 } catch (err) {
    res.status(500).json({
        message:"Error creating trigger",
        error: err,
    })
 }
};
//GET BY ID

export const getAvailableTriggersById = async(req:Request,res:Response) =>{
    try {
        const id = req.params.id as string  ;

        const trigger = await prisma.availableTrigger.findUnique({
            where: {id},
        });
        if (!trigger){
            return res.status(404).json({
                message:"Trigger not found",
            });
        }
        res.status(200).json({
            message:"Trigger fetched successfully", trigger
        });
    } catch (err) {
        res.status(500).json({
            message:"Error fetching Trigger",
            error:err,
        })
        
    }
};

//GET ALL

export const getAvailableTriggers = async(req:Request, res:Response) =>{
    try {
        const triggers = await prisma.availableTrigger.findMany();
        res.status(200).json({
            message:"Triggers fetched successfully",triggers
        });
    } catch (err) {
        res.status(500).json({
            message:"Error fetching Triggers",
            error:err,
        });
    }
}

//UPDATE

export const updateAvailableTriggers = async (req:Request, res:Response)=>{
    try {
        const id = req.params.id as string;
        const {name, type, icon}= req.body;

        const trigger = await prisma.availableTrigger.update({
            where:{id},
            data : {
                 ...(name && { name }),
                 ...(type && { type }),
                 ...(icon && { icon }),
            }
        });
        res.status(200).json({
            message: "Trigger updated successfully",trigger
        })
    } catch (err) {
        res.status(500).json({
            message:"Error updating trigger",
            error:err,
        })        
    }
};