import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getWorkflow = async (workflowId: string) => {
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
    },
    include: {
      actions: {
        include: {
          availableAction: true, // ← contains type, name, icon, etc
        },
      },
      trigger: {
        include: {
          availableTrigger: true,
        },
      },
      edges: true,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  return workflow;
};
