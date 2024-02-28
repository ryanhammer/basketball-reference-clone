-- CreateTable
CREATE TABLE "coach" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "external_id" TEXT,

    CONSTRAINT "coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "head_coach_game" (
    "id" TEXT NOT NULL,
    "coach_id" TEXT NOT NULL,
    "team_game_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "head_coach_game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "head_coach_game" ADD CONSTRAINT "head_coach_game_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "head_coach_game" ADD CONSTRAINT "head_coach_game_team_game_id_fkey" FOREIGN KEY ("team_game_id") REFERENCES "team_game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "head_coach_game" ADD CONSTRAINT "head_coach_game_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
