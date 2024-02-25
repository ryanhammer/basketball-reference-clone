import { Prisma } from '@prisma/client';
import { utcToZonedTime, format } from 'date-fns-tz';
import { GameSummary, Venue as SportradarVenue } from '../types/sportrader';
import { getSeasonByLeagueYearAndType } from '../../db/access/season';
import { getTeamByExternalId } from '../../db/access/team';
import { createVenue, getVenueByExternalId } from '../../db/access/venue';

export async function prepareGameSummaryToGame(
  gameSummary: GameSummary,
  leagueId: string
): Promise<Prisma.GameCreateArgs['data']> {
  const season = await getSeasonByLeagueYearAndType({ leagueId, year: 2023, type: 'REG' });
  const [homeTeam, awayTeam] = await Promise.all([
    getTeamByExternalId(gameSummary.home.id),
    getTeamByExternalId(gameSummary.away.id),
  ]);
  let venue = await getVenueByExternalId(gameSummary.venue.id);

  if (!venue) {
    const venueCreateData = createVenueData(gameSummary.venue);

    venue = await createVenue(venueCreateData);
  }

  const { id, scheduled, duration, attendance, home, away } = gameSummary;

  let homeTeamOTPoints;
  let awayTeamOTPoints;

  if (home.scoring.length > 4) {
    homeTeamOTPoints = home.scoring.slice(4).reduce((acc, scoring) => acc + scoring.points, 0);
    awayTeamOTPoints = away.scoring.slice(4).reduce((acc, scoring) => acc + scoring.points, 0);
  }

  const [homeTeamGameInput, awayTeamGameInput] = await Promise.all([prepareGameSummaryToTeamGames(gameSummary, homeTeam.id),
    prepareGameSummaryToTeamGames(gameSummary, awayTeam.id)]);

  return {
    externalId: id,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    seasonId: season.id,
    date: format(utcToZonedTime(scheduled, 'America/New_York'), 'EEE, MMM dd, yyyy'),
    scheduledStart: new Date(scheduled),
    duration: Number(duration),
    attendance,
    venueId: venue.id,
    homeTeamPoints: home.points,
    awayTeamPoints: away.points,
    homeTeamQ1Points: home.scoring[0].points,
    homeTeamQ2Points: home.scoring[1].points,
    homeTeamQ3Points: home.scoring[2].points,
    homeTeamQ4Points: home.scoring[3].points,
    homeTeamOTPoints,
    awayTeamQ1Points: away.scoring[0].points,
    awayTeamQ2Points: away.scoring[1].points,
    awayTeamQ3Points: away.scoring[2].points,
    awayTeamQ4Points: away.scoring[3].points,
    awayTeamOTPoints,
    notes: gameSummary.inseason_tournament ? 'Inseason Tournament' : null,
    teamGames: {
      createMany: {
        data: [
          homeTeamGameInput, awayTeamGameInput
        ]
      }
    }
  };
}

function createVenueData({ id, ...rest }: SportradarVenue) {
  return {
    externalId: id,
    ...rest,
  };
}

export async function prepareGameSummaryToTeamGames(gameSummary: GameSummary, teamSeasonId: string): Promise<Prisma.TeamGameCreateManySeasonGameInput> {
  const secondsPlayed = convertGameMinutesToSeconds(gameSummary.duration) * 5;
  
  return {
    teamSeasonId,
    points: gameSummary.home.points,
    oppPoints: gameSummary.away.points,
    secondsPlayed,
    fieldGoals: gameSummary.home.statistics.field_goals_made,
    fieldGoalAttempts: gameSummary.home.statistics.field_goals_att,
    threePointers: gameSummary.home.statistics.three_points_made,
    threePointAttempts: gameSummary.home.statistics.three_points_att,
    twoPointers: gameSummary.home.statistics.two_points_made,
    twoPointAttempts: gameSummary.home.statistics.two_points_att,
    freeThrows: gameSummary.home.statistics.free_throws_made,
    freeThrowAttempts: gameSummary.home.statistics.free_throws_att,
    assists: gameSummary.home.statistics.assists,
    rebounds: gameSummary.home.statistics.team_rebounds,
    offRebounds: gameSummary.home.statistics.team_offensive_rebounds,
    defRebounds: gameSummary.home.statistics.team_defensive_rebounds,
    steals: gameSummary.home.statistics.steals,
    blocks: gameSummary.home.statistics.blocks,
    turnovers: gameSummary.home.statistics.team_turnovers,
    personalFouls: gameSummary.home.statistics.personal_fouls,
    possessions: gameSummary.home.statistics.possessions, // TODO: calculate possessions
    oppPossessions: gameSummary.away.statistics.possessions,
    pace: (gameSummary.home.statistics.possessions + gameSummary.away.statistics.possessions)/(2 * (secondsPlayed/(60 * 5))/48),
    offRating: gameSummary.home.statistics.offensive_rating, // TODO: calculate offensive rating
    defRating: gameSummary.home.statistics.defensive_rating,
  }
}

export async function prepareGameSummaryToPlayerGames({gameSummary, teamPossessionCount}: {gameSummary: GameSummary; teamPossessionCount: number}): Promise<Prisma.PlayerGameCreateArgs['data']> {
  return {
    playerId             String   
    gameId               String   
    playerSeasonId       String   
    points               Int
    secondsPlayed        Int      
    fieldGoals           Int      
    fieldGoalAttempts    Int      
    threePointers        Int      
    threePointAttempts   Int      
    twoPointers          Int      
    twoPointAttempts     Int      
    freeThrows           Int      
    freeThrowAttempts    Int      
    assists              Int
    rebounds             Int
    offRebounds          Int      
    defRebounds          Int      
    steals               Int
    blocks               Int
    turnovers            Int
    personalFouls        Int      
    plusMinus            Int      
    offensivePossessions Decimal  @default(0) @map("offensive_possessions")
    defensivePossessions Decimal  @default(0) @map("defensive_possessions")
    createdAt            DateTime @default(now()) @map("created_at")
    updatedAt            DateTime @updatedAt @map("updated_at")
}

id                   String   @id @default(cuid())
  playerId             String   @map("player_id")
  teamSeasonId         String   @map("team_season_id")
  seasonId             String   @map("season_id")
  gamesPlayed          Int      @default(0) @map("games_played")
  gamesStarted         Int      @default(0) @map("games_started")
  isTwoWayContract     Boolean  @map("is_two_way_contract")
  jerseyNumbers        Int[]    @map("jersey_number")
  points               Int      @default(0)
  secondsPlayed        Int      @default(0) @map("seconds_played")
  fieldGoals           Int      @default(0) @map("field_goals")
  fieldGoalAttempts    Int      @default(0) @map("field_goal_attempts")
  threePointers        Int      @default(0) @map("three_pointers")
  threePointAttempts   Int      @default(0) @map("three_point_attempts")
  twoPointers          Int      @default(0) @map("two_pointers")
  twoPointAttempts     Int      @default(0) @map("two_point_attempts")
  freeThrows           Int      @default(0) @map("free_throws")
  freeThrowAttempts    Int      @default(0) @map("free_throw_attempts")
  assists              Int      @default(0)
  rebounds             Int      @default(0)
  offRebounds          Int      @default(0) @map("off_rebounds")
  defRebounds          Int      @default(0) @map("def_rebounds")
  steals               Int      @default(0)
  blocks               Int      @default(0)
  turnovers            Int      @default(0)
  personalFouls        Int      @default(0) @map("personal_fouls")
  plusMinus            Int      @default(0) @map("plus_minus")
  offensivePossessions Decimal  @default(0) @map("offensive_possessions")
  defensivePossessions Decimal  @default(0) @map("defensive_possessions")
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  player      Player       @relation(fields: [playerId], references: [id])
  teamSeason  TeamSeason   @relation(fields: [teamSeasonId], references: [id])
  season      Season       @relation(fields: [seasonId], references: [id])
  playerGames PlayerGame[]

  @@map("player_season")
}

function convertGameMinutesToSeconds(minutes: string): number {
  return Number(minutes.split(':')[0]) * 60 + Number(minutes.split(':')[1]);
}

const playerGameCreate = 