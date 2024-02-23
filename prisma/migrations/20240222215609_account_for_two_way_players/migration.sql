/*
  Warnings:

  - Added the required column `is_two_way_contract` to the `player_season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player_season" ADD COLUMN     "is_two_way_contract" BOOLEAN NOT NULL,
ADD COLUMN     "jersey_number" INTEGER[];
