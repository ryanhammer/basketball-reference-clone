/*
  Warnings:

  - Changed the type of `height` on the `player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "player" DROP COLUMN "height",
ADD COLUMN     "height" INTEGER NOT NULL;
