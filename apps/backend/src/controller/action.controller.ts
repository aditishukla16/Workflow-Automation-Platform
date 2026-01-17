import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createAvailableAction = async (req: Request, res: Response) => {
    try {
        const { name, icon, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                message: "name and type are required"
            });
        }
        const action = await prisma.availableAction.create({
            data: {
                type,
                icon,
                name
            }
        })
        res.status(200).json({
            message: "Action created successfully", action
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            error: err
        })

    }

}
export const getAvailableActionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const action = await prisma.availableAction.findUnique({
            where: {
                id
            }
        });
        if (!action) {
            return res.status(404).json({
                message: "Action not found"
            });
        }
        res.status(200).json({
            message: "Action fetched successfully", action
        })


    } catch (err) {
        res.status(500).json({
            message: "Error fetching action",
            error: err
        })

    }
}
export const getAvailableActions = async (req: Request, res: Response) => {
    try {
        const actions = await prisma.availableAction.findMany()
        res.status(200).json({
            message: "Actions fetched successfully", actions
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching actions",
            error: err
        })
    }
}

export const updateAvailableAction = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, icon } = req.body;
        const existingAction = await prisma.availableAction.findUnique({
            where: {
                id
            },
        });
        if (!existingAction) {
            return res.status(404).json({
                message: "Action not found"
            });
        }

        const action = await prisma.availableAction.update({
            where: { id },
            data: { name, icon }
        })
       
        res.status(200).json({
            message: "Action updated successfully", action
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching action",
            error: err
        })

    }
}