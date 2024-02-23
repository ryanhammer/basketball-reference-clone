/*
  Warnings:

  - You are about to drop the column `year_created` on the `franchise` table. All the data in the column will be lost.
  - You are about to drop the column `year_defunct` on the `franchise` table. All the data in the column will be lost.
  - You are about to drop the column `year_created` on the `league` table. All the data in the column will be lost.
  - You are about to drop the column `year_defunct` on the `league` table. All the data in the column will be lost.
  - You are about to drop the column `year_created` on the `team` table. All the data in the column will be lost.
  - You are about to drop the column `year_defunct` on the `team` table. All the data in the column will be lost.
  - Added the required column `inaugural_season` to the `franchise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inaugural_season` to the `league` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inaugural_season` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "franchise" DROP COLUMN "year_created",
DROP COLUMN "year_defunct",
ADD COLUMN     "final_season" TEXT,
ADD COLUMN     "inaugural_season" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "league" DROP COLUMN "year_created",
DROP COLUMN "year_defunct",
ADD COLUMN     "final_season" TEXT,
ADD COLUMN     "inaugural_season" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "team" DROP COLUMN "year_created",
DROP COLUMN "year_defunct",
ADD COLUMN     "final_season" TEXT,
ADD COLUMN     "inaugural_season" TEXT NOT NULL;
