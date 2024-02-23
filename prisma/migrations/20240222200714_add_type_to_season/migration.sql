/*
  Warnings:

  - Added the required column `type` to the `season` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeasonType" AS ENUM ('REG', 'IST', 'PST', 'PRE');

-- AlterTable
ALTER TABLE "season" ADD COLUMN     "type" "SeasonType" NOT NULL;
