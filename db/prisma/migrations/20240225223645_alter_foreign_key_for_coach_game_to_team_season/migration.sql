-- DropForeignKey
ALTER TABLE "head_coach_game" DROP CONSTRAINT "head_coach_game_season_id_fkey";

-- AddForeignKey
ALTER TABLE "head_coach_game" ADD CONSTRAINT "head_coach_game_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "team_season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
