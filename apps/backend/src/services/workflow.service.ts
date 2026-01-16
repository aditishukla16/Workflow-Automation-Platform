import { prisma } from "../lib/prisma";

/**
 * CREATE WORKFLOW
 */
export const createWorkflow = async (
  title: string,
  nodes: any,
  connections: any,
  userId: string
) => {
  return prisma.workflow.create({
    data: {
      title,
      nodes,
      connections,
      userId,
      enabled: true,
    },
  });
};

/**
 * GET ALL WORKFLOWS FOR A USER
 */
export const getWorkflowsByUser = async (userId: string) => {
  return prisma.workflow.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      enabled: true,
      createdAt: true,
    },
  });
};

/**
 * GET WORKFLOW BY ID (WITH OWNERSHIP CHECK)
 */
export const getWorkflowById = async (
  workflowId: string,
  userId: string
) => {
  return prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });
};

/**
 * UPDATE WORKFLOW
 */
export const updateWorkflow = async (
  workflowId: string,
  userId: string,
  data: {
    title?: string;
    nodes?: any;
    connections?: any;
    enabled?: boolean;
  }
) => {
  const existingWorkflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!existingWorkflow) {
    return null;
  }

  return prisma.workflow.update({
    where: { id: workflowId },
    data,
  });
};

/**
 * DELETE WORKFLOW
 */
export const deleteWorkflow = async (
  workflowId: string,
  userId: string
) => {
  const existingWorkflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!existingWorkflow) {
    return null;
  }

  return prisma.workflow.delete({
    where: { id: workflowId },
  });
};
