-- DropForeignKey
ALTER TABLE "Projeto" DROP CONSTRAINT "Projeto_userId_fkey";

-- AlterTable
ALTER TABLE "Projeto" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
