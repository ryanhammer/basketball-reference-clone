/*
  Warnings:

  - Added the required column `did_start` to the `player_game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player_game" ADD COLUMN     "did_start" BOOLEAN NOT NULL;
