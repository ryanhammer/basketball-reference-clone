-- CreateTable
CREATE TABLE "league" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "year_created" INTEGER NOT NULL,
    "year_defunct" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "league_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "year_created" INTEGER NOT NULL,
    "year_defunct" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "franchise_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "year_created" INTEGER NOT NULL,
    "year_defunct" INTEGER,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "birth_city" TEXT NOT NULL,
    "birth_state" TEXT,
    "birth_country" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "shooting_hand" TEXT NOT NULL,
    "college" TEXT,
    "recruiting_year" INTEGER,
    "recruiting_rank" INTEGER,
    "draft_team" TEXT,
    "draft_round" INTEGER,
    "draft_position" INTEGER,
    "nba_debut" TIMESTAMP(3),
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season" (
    "id" TEXT NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER NOT NULL,
    "league_id" TEXT NOT NULL,
    "is_current" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "external_id" TEXT,

    CONSTRAINT "season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_season" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "is_current" BOOLEAN NOT NULL,
    "venue_id" TEXT NOT NULL,
    "conference" TEXT,
    "division" TEXT,
    "attendance" INTEGER NOT NULL DEFAULT 0,
    "attendance_rank" INTEGER NOT NULL DEFAULT 1,
    "games_played" INTEGER NOT NULL DEFAULT 0,
    "games_won" INTEGER NOT NULL DEFAULT 0,
    "games_lost" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "opp_points" INTEGER NOT NULL DEFAULT 0,
    "minutes_played" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "field_goals" INTEGER NOT NULL DEFAULT 0,
    "field_goal_attempts" INTEGER NOT NULL DEFAULT 0,
    "three_pointers" INTEGER NOT NULL DEFAULT 0,
    "three_point_attempts" INTEGER NOT NULL DEFAULT 0,
    "two_pointers" INTEGER NOT NULL DEFAULT 0,
    "two_point_attempts" INTEGER NOT NULL DEFAULT 0,
    "free_throws" INTEGER NOT NULL DEFAULT 0,
    "free_throw_attempts" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "rebounds" INTEGER NOT NULL DEFAULT 0,
    "off_rebounds" INTEGER NOT NULL DEFAULT 0,
    "def_rebounds" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "turnovers" INTEGER NOT NULL DEFAULT 0,
    "personal_fouls" INTEGER NOT NULL DEFAULT 0,
    "possessions" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "opp_possessions" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "pace" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "off_rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "def_rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT NOT NULL,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "attendance" INTEGER,
    "duration" INTEGER,
    "scheduled_start" TIMESTAMP(3) NOT NULL,
    "home_team_points" INTEGER NOT NULL,
    "away_team_points" INTEGER NOT NULL,
    "home_team_q1_points" INTEGER NOT NULL,
    "home_team_q2_points" INTEGER NOT NULL,
    "home_team_q3_points" INTEGER NOT NULL,
    "home_team_q4_points" INTEGER NOT NULL,
    "home_team_ot_points" INTEGER,
    "away_team_q1_points" INTEGER NOT NULL,
    "away_team_q2_points" INTEGER NOT NULL,
    "away_team_q3_points" INTEGER NOT NULL,
    "away_team_q4_points" INTEGER NOT NULL,
    "away_team_ot_points" INTEGER,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_game" (
    "id" TEXT NOT NULL,
    "team_season_id" TEXT NOT NULL,
    "season_game_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "opp_points" INTEGER NOT NULL,
    "seconds_played" INTEGER NOT NULL,
    "field_goals" INTEGER NOT NULL,
    "field_goal_attempts" INTEGER NOT NULL,
    "three_pointers" INTEGER NOT NULL,
    "three_point_attempts" INTEGER NOT NULL,
    "two_pointers" INTEGER NOT NULL,
    "two_point_attempts" INTEGER NOT NULL,
    "free_throws" INTEGER NOT NULL,
    "free_throw_attempts" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "rebounds" INTEGER NOT NULL,
    "off_rebounds" INTEGER NOT NULL,
    "def_rebounds" INTEGER NOT NULL,
    "steals" INTEGER NOT NULL,
    "blocks" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "personal_fouls" INTEGER NOT NULL,
    "possessions" DECIMAL(65,30) NOT NULL,
    "opp_possessions" DECIMAL(65,30) NOT NULL,
    "pace" DECIMAL(65,30) NOT NULL,
    "off_rating" DECIMAL(65,30) NOT NULL,
    "def_rating" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_season" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "team_season_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "games_played" INTEGER NOT NULL,
    "games_started" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "seconds_played" INTEGER NOT NULL DEFAULT 0,
    "field_goals" INTEGER NOT NULL DEFAULT 0,
    "field_goal_attempts" INTEGER NOT NULL DEFAULT 0,
    "three_pointers" INTEGER NOT NULL DEFAULT 0,
    "three_point_attempts" INTEGER NOT NULL DEFAULT 0,
    "two_pointers" INTEGER NOT NULL DEFAULT 0,
    "two_point_attempts" INTEGER NOT NULL DEFAULT 0,
    "free_throws" INTEGER NOT NULL DEFAULT 0,
    "free_throw_attempts" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "rebounds" INTEGER NOT NULL DEFAULT 0,
    "off_rebounds" INTEGER NOT NULL DEFAULT 0,
    "def_rebounds" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "turnovers" INTEGER NOT NULL DEFAULT 0,
    "personal_fouls" INTEGER NOT NULL DEFAULT 0,
    "plus_minus" INTEGER NOT NULL DEFAULT 0,
    "offensive_possessions" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "defensive_possessions" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_game" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "player_season_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "seconds_played" INTEGER NOT NULL,
    "field_goals" INTEGER NOT NULL,
    "field_goal_attempts" INTEGER NOT NULL,
    "three_pointers" INTEGER NOT NULL,
    "three_point_attempts" INTEGER NOT NULL,
    "two_pointers" INTEGER NOT NULL,
    "two_point_attempts" INTEGER NOT NULL,
    "free_throws" INTEGER NOT NULL,
    "free_throw_attempts" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "rebounds" INTEGER NOT NULL,
    "off_rebounds" INTEGER NOT NULL,
    "def_rebounds" INTEGER NOT NULL,
    "steals" INTEGER NOT NULL,
    "blocks" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "personal_fouls" INTEGER NOT NULL,
    "plus_minus" INTEGER NOT NULL,
    "offensive_possessions" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "defensive_possessions" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "official" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "external_id" TEXT,

    CONSTRAINT "official_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "official_game" (
    "id" TEXT NOT NULL,
    "official_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "assignment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "official_game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "league_name_key" ON "league"("name");

-- CreateIndex
CREATE UNIQUE INDEX "league_abbreviation_key" ON "league"("abbreviation");

-- AddForeignKey
ALTER TABLE "franchise" ADD CONSTRAINT "franchise_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season" ADD CONSTRAINT "season_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_season" ADD CONSTRAINT "team_season_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_season" ADD CONSTRAINT "team_season_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_season" ADD CONSTRAINT "team_season_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "team_season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "team_season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game" ADD CONSTRAINT "team_game_team_season_id_fkey" FOREIGN KEY ("team_season_id") REFERENCES "team_season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game" ADD CONSTRAINT "team_game_season_game_id_fkey" FOREIGN KEY ("season_game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_season" ADD CONSTRAINT "player_season_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_season" ADD CONSTRAINT "player_season_team_season_id_fkey" FOREIGN KEY ("team_season_id") REFERENCES "team_season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_season" ADD CONSTRAINT "player_season_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_game" ADD CONSTRAINT "player_game_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_game" ADD CONSTRAINT "player_game_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_game" ADD CONSTRAINT "player_game_player_season_id_fkey" FOREIGN KEY ("player_season_id") REFERENCES "player_season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "official_game" ADD CONSTRAINT "official_game_official_id_fkey" FOREIGN KEY ("official_id") REFERENCES "official"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "official_game" ADD CONSTRAINT "official_game_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
