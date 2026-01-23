import { Resend } from "resend";
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendWorkflowForProcess } from "./processWorkflow";
import { getWorkflow } from "./getWorkflow";
import { generateHtml } from "./helper/generatedHtml";
import { IncomingEmail } from "../types/express";
import prisma from "../lib/prisma";

const router = Router();

/* ---------------- MEMORY ---------------- */

const inputMetadata: Map<string, any> = new Map();

/* ---------------- HELPERS ---------------- */

const replaceTokens = (template: string, data: Record<string, any>) =>
  template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : "";
  });
  export const getNextActionMetadata = (
  actions: any[],
  actionId: string
) => {
  const sorted = [...actions].sort(
    (a, b) => a.sortingOrder - b.sortingOrder
  );

  const index = sorted.findIndex(a => a.id === actionId);

  if (index === -1) return null;
  if (index === sorted.length - 1) return null;

  return sorted[index + 1];
};


/* ---------------- SEND MAIL ---------------- */

export const sendMail = async (action: any, input: any) => {
  const cfg = action.metadata.actionData.config;

  const resend = new Resend(
    replaceTokens(cfg.resendApi, input)
  );

  await resend.emails.send({
    from: replaceTokens(cfg.fromEmail, input),
    to: input.emailId,
    subject: replaceTokens(cfg.subject, input),
    html: replaceTokens(cfg.body, input),
  });
};

/* ---------------- SEND MAIL + WAIT ---------------- */

export const sendMailAndWait = async (
  workflow: any,
  action: any,
  input: any
) => {
  try {
    const cfg = action.metadata.actionData.config;

    const nextAction =
      [...workflow.actions]
        .sort((a: any, b: any) => a.sortingOrder - b.sortingOrder)
        .find((a: any) => a.sortingOrder > action.sortingOrder);

    const execution = await prisma.execution.create({
      data: {
        status: "WAITING",
        pointer: nextAction?.id ?? null,
        metadata: { input },

        workflow: {
          connect: { id: workflow.id },
        },

        action: {
          connect: { id: action.id },
        },
      },
    });

    const html = generateHtml(
      action.metadata.actionData.waitFields,
      replaceTokens(cfg.body, input)
    );

    const resend = new Resend(
      replaceTokens(cfg.resendApi, input)
    );

    await resend.emails.send({
      from: replaceTokens(cfg.fromEmail, input),
      to: input.emailId,
      replyTo: `${execution.id}@reply.coursehubb.store`,
      subject: replaceTokens(cfg.subject, input),
      html,
    });

    inputMetadata.set(execution.id, input);

    return execution;
  } catch (err) {
    console.error("[sendMailAndWait]", err);
  }
};

/* ---------------- INBOUND EMAIL ---------------- */

router.post("/email/inbound", async (req: Request, res: Response) => {
  const body = req.body;

  const email: IncomingEmail = {
    fromName: body.FromName,
    fromEmail: body.From,
    to: body.To,
    subject: body.Subject,
    messageId: body.MessageID,
    date: body.Date,
    textBody: body.TextBody,
    htmlBody: body.HtmlBody,
    strippedTextReply: body.StrippedTextReply,
    attachments: body.Attachments || [],
  };

  const executionId = email.to.split("@")[0];

  const execution = await prisma.execution.findUnique({
    where: { id: executionId },
  });

  if (!execution) {
    return res.status(404).json({ message: "Execution not found" });
  }

  const oldMeta = (execution.metadata as any) || {};

  await prisma.execution.update({
    where: { id: executionId },
    data: {
      status: "SUCCESS",
      metadata: {
        ...oldMeta,
        emailReply: email,
      },
    },
  });

  const workflow = await getWorkflow(execution.workflowId);

  const input = oldMeta.input ?? {};
  input.emailReply = email;

  await sendWorkflowForProcess(
    workflow,
    input,
    execution.pointer ?? undefined,
    execution
  );

  res.json({ message: "Email processed successfully" });
});

/* ---------------- EXPORT ---------------- */

export const postmarkRouter = router;
