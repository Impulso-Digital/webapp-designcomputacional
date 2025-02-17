/*
  Warnings:

  - You are about to drop the column `projectFile` on the `Projeto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projeto" DROP COLUMN "projectFile",
ADD COLUMN     "projetoFile" TEXT;
