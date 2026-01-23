/*
  Warnings:

  - Added the required column `actionId` to the `Execution` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `Execution` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Execution" ADD COLUMN     "actionId" TEXT NOT NULL,
ADD COLUMN     "pointer" TEXT,
ALTER COLUMN "status" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
