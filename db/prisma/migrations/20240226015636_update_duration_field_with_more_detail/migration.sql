/*
  Warnings:

  - You are about to drop the column `duration` on the `game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "game" DROP COLUMN "duration",
ADD COLUMN     "duration_in_minutes" INTEGER;
