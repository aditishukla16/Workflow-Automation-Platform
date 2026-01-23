/*
  Warnings:

  - Added the required column `status` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "status" TEXT NOT NULL;
