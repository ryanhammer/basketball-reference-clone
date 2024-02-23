/*
  Warnings:

  - You are about to drop the column `end_year` on the `season` table. All the data in the column will be lost.
  - You are about to drop the column `start_year` on the `season` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "season" DROP COLUMN "end_year",
DROP COLUMN "start_year",
ADD COLUMN     "end_date" TEXT NOT NULL,
ADD COLUMN     "start_date" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
