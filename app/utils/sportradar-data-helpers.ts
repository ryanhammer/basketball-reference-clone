import { PlayerSeason, Prisma, TeamSeason } from '@prisma/client';
import { getSeasonByLeagueYearAndType } from '../../db/access/season';
import { getTeamByExternalId } from '../../db/access/team';
import { createVenue, getVenueByExternalId } from '../../db/access/venue';
import { createPlayer, getPlayerByExternalId } from '../../db/access/player';
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
import { getTeamSeasonByTeamIdAndSeasonId, updateTeamSeason } from '../../db/access/team-season';
import {
  GameSummary,
  TeamGameSummary,
  PlayerGameSummary,
  CoachData,
  Venue as SportradarVenue,
  Official,
  TeamGameStatistics,
} from '../types/sportradar/game-summary';
import { getPlayerProfileBySportradarId } from './sportradar-access-functions';
import { determinePlayerBirthplaceInfo } from './model-utils';

export async function prepareGameSummaryToGame(
  gameSummary: GameSummary,
  leagueId: string
): Promise<{ gameCreateData: Prisma.GameCreateArgs['data']; homeTeamSeason: TeamSeason; awayTeamSeason: TeamSeason }> {
  const season = await getSeasonByLeagueYearAndType({ leagueId, year: 2023, type: 'REG' });
  const [homeTeam, awayTeam] = await Promise.all([
    getTeamByExternalId(gameSummary.home.id),
    getTeamByExternalId(gameSummary.away.id),
  ]);

  const [homeTeamSeason, awayTeamSeason] = await Promise.all([
    getTeamSeasonByTeamIdAndSeasonId(homeTeam.id, season.id),
    getTeamSeasonByTeamIdAndSeasonId(awayTeam.id, season.id),
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
      teamSeasonId: homeTeamSeason.id,
    }),
    prepareGameSummaryToTeamGames({
      gameSummaryDuration: gameSummary.duration,
      teamGameSummary: away,
      opponentGameSummary: home,
      teamSeasonId: awayTeamSeason.id,
    }),
  ]);

  return {
    gameCreateData: {
      externalId: id,
      homeTeamId: homeTeamSeason.id,
      awayTeamId: awayTeamSeason.id,
      seasonId: season.id,
      date: convertScheduledGameStartFromUTCtoEST(scheduled),
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
    },
    homeTeamSeason,
    awayTeamSeason,
  };
}

export async function updateTeamSeasonFromGameSummary({
  teamSeason,
  teamGameStatistics,
  opponentGameStatistics,
  attendance,
  minutesPlayed,
}: {
  teamSeason: TeamSeason;
  teamGameStatistics: TeamGameStatistics;
  opponentGameStatistics: TeamGameStatistics;
  attendance: number;
  minutesPlayed: number;
}): Promise<void> {
  const possessions = Number(teamSeason.possessions) + teamGameStatistics.possessions;
  const oppPossessions = Number(teamSeason.oppPossessions) + opponentGameStatistics.possessions;
  const totalMinutesPlayed = Number(teamSeason.minutesPlayed) + minutesPlayed;

  await updateTeamSeason(teamSeason.id, {
    attendance: teamSeason.attendance + attendance,
    gamesPlayed: teamSeason.gamesPlayed + 1,
    gamesWon: teamSeason.gamesWon + teamGameStatistics.pls_min > 0 ? 1 : 0,
    gamesLost: teamSeason.gamesLost + teamGameStatistics.pls_min < 0 ? 1 : 0,
    points: teamSeason.points + teamGameStatistics.points,
    oppPoints: teamSeason.oppPoints + opponentGameStatistics.points,
    minutesPlayed: totalMinutesPlayed,
    fieldGoals: teamSeason.fieldGoals + teamGameStatistics.field_goals_made,
    fieldGoalAttempts: teamSeason.fieldGoalAttempts + teamGameStatistics.field_goals_att,
    threePointers: teamSeason.threePointers + teamGameStatistics.three_points_made,
    threePointAttempts: teamSeason.threePointAttempts + teamGameStatistics.three_points_att,
    twoPointers: teamSeason.twoPointers + teamGameStatistics.two_points_made,
    twoPointAttempts: teamSeason.twoPointAttempts + teamGameStatistics.two_points_att,
    freeThrows: teamSeason.freeThrows + teamGameStatistics.free_throws_made,
    freeThrowAttempts: teamSeason.freeThrowAttempts + teamGameStatistics.free_throws_att,
    assists: teamSeason.assists + teamGameStatistics.assists,
    rebounds: teamSeason.rebounds + teamGameStatistics.team_rebounds,
    offRebounds: teamSeason.offRebounds + teamGameStatistics.team_offensive_rebounds,
    defRebounds: teamSeason.defRebounds + teamGameStatistics.team_defensive_rebounds,
    steals: teamSeason.steals + teamGameStatistics.steals,
    blocks: teamSeason.blocks + teamGameStatistics.blocks,
    turnovers: teamSeason.turnovers + teamGameStatistics.team_turnovers,
    possessions, // TODO: calculate possessions
    oppPossessions,
    pace: (teamGameStatistics.possessions + opponentGameStatistics.possessions) / ((2 * totalMinutesPlayed) / 48),
    offRating: (teamSeason.points + teamGameStatistics.points) / possessions, // TODO: calculate offensive rating
    defRating: (teamSeason.oppPoints + opponentGameStatistics.points) / oppPossessions,
  });
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
  let player = await getPlayerByExternalId(playerGameSummary.id);

  if (!player) {
    const playerProfileData = await getPlayerProfileBySportradarId(playerGameSummary.id);

    player = await createPlayer({
      externalId: playerGameSummary.id,
      fullName: playerProfileData.full_name,
      firstName: playerProfileData.first_name,
      lastName: playerProfileData.last_name,
      shootingHand: 'right', // TODO: update player data with correct shooting hand
      position: playerProfileData.position,
      height: playerProfileData.height,
      weight: playerProfileData.weight,
      birthDate: playerProfileData.birthdate,
      ...determinePlayerBirthplaceInfo(playerProfileData.birth_place),
      college: playerProfileData.college,
      playerSeasons: {
        create: [
          {
            teamSeasonId,
            seasonId,
            jerseyNumbers: [Number(playerGameSummary.jersey_number)],
            isTwoWayContract: false, // TODO: update playerSeason data with correct two-way contract status
          },
        ],
      },
    });
  }

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

function convertScheduledGameStartFromUTCtoEST(scheduled: string): string {
  const date = new Date(scheduled);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  // Use Intl.DateTimeFormat with the defined options to format the date
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
