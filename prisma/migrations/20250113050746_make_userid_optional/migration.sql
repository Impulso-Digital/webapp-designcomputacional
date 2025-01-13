/*
  Warnings:

  - Made the column `userId` on table `Projeto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Projeto" DROP CONSTRAINT "Projeto_userId_fkey";

-- AlterTable
ALTER TABLE "Projeto" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
