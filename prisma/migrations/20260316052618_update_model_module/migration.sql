/*
  Warnings:

  - Added the required column `cspmoduleid` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "cspmoduleid" INTEGER NOT NULL;
