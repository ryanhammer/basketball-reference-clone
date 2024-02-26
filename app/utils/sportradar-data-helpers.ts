import { PlayerSeason, Prisma } from '@prisma/client';
import { utcToZonedTime, format } from 'date-fns-tz';
import { getSeasonByLeagueYearAndType } from '../../db/access/season';
import { getTeamByExternalId } from '../../db/access/team';
import { createVenue, getVenueByExternalId } from '../../db/access/venue';
import { getPlayerByExternalId } from '../../db/access/player';
import {
  getPlayerSeasonByPlayerIdAndTeamSeasonId,
  createPlayerSeason,
  updatePlayerSeasonJerseyNumbers,
  updatePlayerSeason,
} from '../../db/access/player-season';
import { createPlayerGame } from '../../db/access/player-game';
import { createCoach, getCoachByExternalId } from '../../db/access/coach';
import { getTeamGameByTeamSeasonIdAndGameId } from '../../db/access/team-game';
import { createOfficial, getOfficialByExternalId } from '../../db/access/official';
import {
  GameSummary,
  TeamGameSummary,
  PlayerGameSummary,
  CoachData,
  Venue as SportradarVenue,
  Official,
} from '../types/sportrader';

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

  const [homeTeamGameInput, awayTeamGameInput] = await Promise.all([
    prepareGameSummaryToTeamGames({
      gameSummaryDuration: gameSummary.duration,
      teamGameSummary: home,
      opponentGameSummary: away,
      teamSeasonId: homeTeam.id,
    }),
    prepareGameSummaryToTeamGames({
      gameSummaryDuration: gameSummary.duration,
      teamGameSummary: away,
      opponentGameSummary: home,
      teamSeasonId: awayTeam.id,
    }),
  ]);

  return {
    externalId: id,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    seasonId: season.id,
    date: format(utcToZonedTime(scheduled, 'America/New_York'), 'EEE, MMM dd, yyyy'),
    scheduledStart: new Date(scheduled),
    durationInMinutes: convertGameMinutesToSeconds(duration), // TODO: rename function to reflect multi-use
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
        data: [homeTeamGameInput, awayTeamGameInput],
      },
    },
  };
}

function createVenueData({ id, ...rest }: SportradarVenue) {
  return {
    externalId: id,
    ...rest,
  };
}

export async function prepareGameSummaryToTeamGames({
  teamSeasonId,
  teamGameSummary,
  opponentGameSummary,
  gameSummaryDuration,
}: {
  teamSeasonId: string;
  teamGameSummary: TeamGameSummary;
  opponentGameSummary: TeamGameSummary;
  gameSummaryDuration: string;
}): Promise<Prisma.TeamGameCreateManySeasonGameInput> {
  const secondsPlayed = convertGameMinutesToSeconds(gameSummaryDuration) * 5;

  return {
    teamSeasonId,
    points: teamGameSummary.points,
    oppPoints: opponentGameSummary.points,
    secondsPlayed,
    fieldGoals: teamGameSummary.statistics.field_goals_made,
    fieldGoalAttempts: teamGameSummary.statistics.field_goals_att,
    threePointers: teamGameSummary.statistics.three_points_made,
    threePointAttempts: teamGameSummary.statistics.three_points_att,
    twoPointers: teamGameSummary.statistics.two_points_made,
    twoPointAttempts: teamGameSummary.statistics.two_points_att,
    freeThrows: teamGameSummary.statistics.free_throws_made,
    freeThrowAttempts: teamGameSummary.statistics.free_throws_att,
    assists: teamGameSummary.statistics.assists,
    rebounds: teamGameSummary.statistics.team_rebounds,
    offRebounds: teamGameSummary.statistics.team_offensive_rebounds,
    defRebounds: teamGameSummary.statistics.team_defensive_rebounds,
    steals: teamGameSummary.statistics.steals,
    blocks: teamGameSummary.statistics.blocks,
    turnovers: teamGameSummary.statistics.team_turnovers,
    personalFouls: teamGameSummary.statistics.personal_fouls,
    possessions: teamGameSummary.statistics.possessions, // TODO: calculate possessions
    oppPossessions: opponentGameSummary.statistics.possessions,
    pace:
      (teamGameSummary.statistics.possessions + opponentGameSummary.statistics.possessions) /
      ((2 * (secondsPlayed / (60 * 5))) / 48),
    offRating: teamGameSummary.statistics.offensive_rating, // TODO: calculate offensive rating
    defRating: opponentGameSummary.statistics.defensive_rating,
  };
}

export async function preparePlayerGameSummaryToPlayerGameAndPlayerSeason({
  playerGameSummary,
  gameId,
  seasonId,
  teamSeasonId,
  teamPossessionCount,
  opponentPossessionCount,
  teamGameDuration,
}: {
  playerGameSummary: PlayerGameSummary;
  gameId: string;
  seasonId: string;
  teamSeasonId: string;
  teamPossessionCount: number;
  opponentPossessionCount: number;
  teamGameDuration: string;
}): Promise<{ playerGameCreateData: Prisma.PlayerGameCreateArgs['data']; playerSeason: PlayerSeason }> {
  const player = await getPlayerByExternalId(playerGameSummary.id);
  let playerSeason = await getPlayerSeasonByPlayerIdAndTeamSeasonId({ playerId: player.id, teamSeasonId });

  if (playerSeason && !playerSeason.jerseyNumbers.includes(Number(playerGameSummary.jersey_number))) {
    playerSeason = await updatePlayerSeasonJerseyNumbers(playerSeason.id, [
      ...playerSeason.jerseyNumbers,
      Number(playerGameSummary.jersey_number),
    ]);
  }

  if (!playerSeason) {
    playerSeason = await createPlayerSeason({
      playerId: player.id,
      teamSeasonId,
      seasonId,
      isTwoWayContract: false,
      jerseyNumbers: [Number(playerGameSummary.jersey_number)],
    });
  }

  const teamSecondsPlayed = convertGameMinutesToSeconds(teamGameDuration);
  const secondsPlayed = convertGameMinutesToSeconds(playerGameSummary.statistics.minutes);

  const playerGameCreateData = {
    playerId: player.id,
    gameId,
    playerSeasonId: playerSeason.id,
    didStart: playerGameSummary.starter === true,
    points: playerGameSummary.statistics.points,
    secondsPlayed,
    fieldGoals: playerGameSummary.statistics.field_goals_made,
    fieldGoalAttempts: playerGameSummary.statistics.field_goals_att,
    threePointers: playerGameSummary.statistics.three_points_made,
    threePointAttempts: playerGameSummary.statistics.three_points_att,
    twoPointers: playerGameSummary.statistics.two_points_made,
    twoPointAttempts: playerGameSummary.statistics.two_points_att,
    freeThrows: playerGameSummary.statistics.free_throws_made,
    freeThrowAttempts: playerGameSummary.statistics.free_throws_att,
    assists: playerGameSummary.statistics.assists,
    rebounds: playerGameSummary.statistics.rebounds,
    offRebounds: playerGameSummary.statistics.offensive_rebounds,
    defRebounds: playerGameSummary.statistics.defensive_rebounds,
    steals: playerGameSummary.statistics.steals,
    blocks: playerGameSummary.statistics.blocks,
    turnovers: playerGameSummary.statistics.turnovers,
    personalFouls: playerGameSummary.statistics.personal_fouls,
    plusMinus: playerGameSummary.statistics.pls_min,
    offensivePossessions: (teamPossessionCount / teamSecondsPlayed) * secondsPlayed,
    defensivePossessions: (opponentPossessionCount / teamSecondsPlayed) * secondsPlayed,
  };

  return { playerGameCreateData, playerSeason };
}

export async function createPlayerGameAndUpdatePlayerSeason(
  playerGameCreateData: Prisma.PlayerGameCreateArgs['data'],
  playerSeason: PlayerSeason
): Promise<void> {
  await Promise.all([
    createPlayerGame(playerGameCreateData),
    updatePlayerSeason(playerSeason.id, {
      gamesPlayed: playerSeason.gamesPlayed + 1,
      gamesStarted: playerSeason.gamesStarted + (playerGameCreateData.didStart ? 1 : 0),
      points: playerSeason.points + playerGameCreateData.points,
      fieldGoals: playerSeason.fieldGoals + playerGameCreateData.fieldGoals,
      fieldGoalAttempts: playerSeason.fieldGoalAttempts + playerGameCreateData.fieldGoalAttempts,
      threePointers: playerSeason.threePointers + playerGameCreateData.threePointers,
      threePointAttempts: playerSeason.threePointAttempts + playerGameCreateData.threePointAttempts,
      twoPointers: playerSeason.twoPointers + playerGameCreateData.twoPointers,
      twoPointAttempts: playerSeason.twoPointAttempts + playerGameCreateData.twoPointAttempts,
      freeThrows: playerSeason.freeThrows + playerGameCreateData.freeThrows,
      freeThrowAttempts: playerSeason.freeThrowAttempts + playerGameCreateData.freeThrowAttempts,
      assists: playerSeason.assists + playerGameCreateData.assists,
      rebounds: playerSeason.rebounds + playerGameCreateData.rebounds,
      offRebounds: playerSeason.offRebounds + playerGameCreateData.offRebounds,
      defRebounds: playerSeason.defRebounds + playerGameCreateData.defRebounds,
      steals: playerSeason.steals + playerGameCreateData.steals,
      blocks: playerSeason.blocks + playerGameCreateData.blocks,
      turnovers: playerSeason.turnovers + playerGameCreateData.turnovers,
      personalFouls: playerSeason.personalFouls + playerGameCreateData.personalFouls,
      plusMinus: playerSeason.plusMinus + playerGameCreateData.plusMinus,
      offensivePossessions:
        Number(playerSeason.offensivePossessions) + Number(playerGameCreateData.offensivePossessions),
      defensivePossessions:
        Number(playerSeason.defensivePossessions) + Number(playerGameCreateData.defensivePossessions),
    }),
  ]);
}

export async function prepareGameSummaryCoachesDataToHeadCoachGame({
  coachesData,
  teamSeasonId,
  gameId,
}: { coachesData: CoachData[]; teamSeasonId: string; gameId: string }): Promise<
  Prisma.HeadCoachGameCreateArgs['data']
> {
  const headCoachSummaryData = coachesData.filter((coach) => coach.position === 'Head Coach')[0];
  const headCoachExternalId = headCoachSummaryData.id;

  if (!headCoachExternalId) {
    throw new Error('Unable to create HeadCoachGame: head coach external id missing');
  }

  let headCoach = await getCoachByExternalId(headCoachExternalId);

  if (!headCoach) {
    headCoach = await createCoach({ externalId: headCoachExternalId, fullName: headCoachSummaryData.full_name });
  }

  const teamGame = await getTeamGameByTeamSeasonIdAndGameId({ teamSeasonId, gameId });

  return {
    coachId: headCoach.id,
    teamGameId: teamGame.id,
    teamSeasonId,
  };
}

export async function prepareGameSummaryOfficialsDataToOfficialGame({
  officialsData,
  gameId,
}: { officialsData: Official[]; gameId: string }): Promise<Prisma.OfficialGameCreateManyArgs['data']> {
  const officialsGameCreateData = await Promise.all(
    officialsData.map(async (officialData) => {
      let official = await getOfficialByExternalId(officialData.id);

      if (!official) {
        official = await createOfficial({ externalId: officialData.id, fullName: officialData.full_name });
      }

      return {
        officialId: official.id,
        gameId,
        number: Number(officialData.number),
        assignment: officialData.assignment,
      };
    })
  );

  return officialsGameCreateData;
}
function convertGameMinutesToSeconds(minutes: string): number {
  return Number(minutes.split(':')[0]) * 60 + Number(minutes.split(':')[1]);
}
