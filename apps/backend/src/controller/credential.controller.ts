import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCredentials = async (req: Request, res: Response) => {
    try {
        const { title, platform, credentials, description, userId } = req.body;

        if (!title || !platform || !userId) {
            return res.status(400).json({
                message: "title, platform and userId are required"
            });
        }
        const credential = await prisma.credential.create({
            data: {
                userId,
                title,
                platform,
                credentials,
                description
            }
        })
        res.status(201).json({
            message: "Credential created successfully", credential
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "internal server error",
           
        })

    }
}
export const getCredentialsById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const credential = await prisma.credential.findUnique({
            where: {
                id
            }
        })
        if (!credential) {
            return res.status(404).json({
                message: "Credential not found"
            });
        }

        res.status(200).json({
            message: "Credential fetched successfully",
            credential
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            
        })
    }
}

export const getCredentials = async (req: Request, res: Response) => {
    try {
        const credentials = await prisma.credential.findMany()
        res.status(200).json({
            message: "Credentials fetched successfully",
            credentials
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Internal server error",
            
        })
    }
}

export const updateCredentials = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, platform, credentials, description } = req.body;
    try {
        const existing = await prisma.credential.findUnique({
            where: {
                id
            },

        })
        if (!existing) {
            return res.status(404).json({ message: "Credential not found" });
        }

        const credential = await prisma.credential.update({
            where: {
                id
            },
            data: {
                title,
                platform,
                credentials,
                description
            }
        })


        res.status(200).json({
            message: "Credential updated successfully",
            credential
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Internal server error",
            
        })
    }
}

export const deleteCredentials = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const credential = await prisma.credential.delete({
            where: {
                id
            }
        })
        res.status(200).json({
            message: "Credential deleted successfully",
            credential
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Internal server error",
            
        })
    }
}       