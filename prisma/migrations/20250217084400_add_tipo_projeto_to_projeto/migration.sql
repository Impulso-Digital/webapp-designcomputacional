/*
  Warnings:

  - Added the required column `tipoProjeto` to the `Projeto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projeto" ADD COLUMN     "tipoProjeto" TEXT NOT NULL;
