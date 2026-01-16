import { Request, Response } from "express";
import { prisma } from "../lib/prisma";


//CREATE WORKFLOW
export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { title, nodes, connections } = req.body;

        if (!title || !nodes || !connections) {
            return res.status(400).json({
                error: "Title, nodes and connections are required",
            });
        }
        const workflow = await prisma.workflow.create({
            data: {
                title,
                nodes,
                connections,
                userId,
                enabled: true,
            },
        });
        return res.status(201).json({
            message: "Workflow created",
            workflow,

        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//GET ALL WORKFLOWS (for logged-in user)
export const getWorkflows = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const workflows = await prisma.workflow.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                enabled: true,
                createdAt: true,
            },
        });
        return res.json({ workflows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//GET WORKFLOW BY ID
export const getWorkflowById = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const workflowId = req.params.id as string;
        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                userId,
            },
        });
        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" });
        }

        return res.json({ workflow });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
//UPDATE WORKFLOW
export const updateWorkflow = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const workflowId = req.params.id as string;
    const { title, nodes, connections, enabled } = req.body;

    // check workflow exists & belongs to user
    const existingWorkflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId,
      },
    });

    if (!existingWorkflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        title,
        nodes,
        connections,
        enabled,
      },
    });

    return res.json({
      message: "Workflow updated successfully",
      workflow: updatedWorkflow,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// DELETE WORKFLOW
export const deleteWorkflow = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const workflowId = req.params.id as string;

    // check workflow exists & belongs to user
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId,
      },
    });

    if (!workflow) {
      return res.status(404).json({
        error: "Workflow not found",
      });
    }

    await prisma.workflow.delete({
      where: {
        id: workflowId,
      },
    });

    return res.json({
      message: "Workflow deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

