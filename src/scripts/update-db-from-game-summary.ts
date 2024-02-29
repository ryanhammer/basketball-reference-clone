import { appDB } from '../../prisma';
import { createGame } from '../access/app-db/game';
import { getLeagueByAbbreviation } from '../access/app-db/league';
import { createHeadCoachGame } from '../access/app-db/head-coach-game';
import { createOfficialGames } from '../access/app-db/official-game';
import { octoberGameIds, novemberGameIds } from '../../public/data/game-data-2023-season';
import { GameSummary } from '../types/sportradar/game-summary';
import {
  prepareGameSummaryToGame,
  updateTeamSeasonFromGameSummary,
  preparePlayerGameSummaryToPlayerGameAndPlayerSeason,
  createPlayerGameAndUpdatePlayerSeason,
  prepareGameSummaryCoachesDataToHeadCoachGame,
  prepareGameSummaryOfficialsDataToOfficialGame,
  delay,
} from '../utils/sportradar-data-helpers';

async function fetchGameSummary(gameId: string): Promise<GameSummary> {
  const apiUrl = `http://api.sportradar.us/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${process.env.SPORTRADAR_API_KEY}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch game summary data. Response status: ${response.status}. Response status text: ${response.statusText}`
    );
  }

  const data = await response.json();

  await delay(1250);

  return data as GameSummary;
}

async function processGameSummaryAndUpdateDb(gameSummaryData: GameSummary) {
  // create game from game summary data
  const league = await getLeagueByAbbreviation('NBA');
  const { gameCreateData, homeTeamSeason, awayTeamSeason } = await prepareGameSummaryToGame(gameSummaryData, league.id);
  const game = await createGame(gameCreateData);

  // update team season stats from team game
  await Promise.all([
    updateTeamSeasonFromGameSummary({
      teamSeason: homeTeamSeason,
      teamGameStatistics: gameSummaryData.home.statistics,
      opponentGameStatistics: gameSummaryData.away.statistics,
      attendance: gameSummaryData.attendance,
      minutesPlayed: game.durationInMinutes ? game.durationInMinutes * 5 : 0,
    }),
    updateTeamSeasonFromGameSummary({
      teamSeason: awayTeamSeason,
      teamGameStatistics: gameSummaryData.away.statistics,
      opponentGameStatistics: gameSummaryData.home.statistics,
      attendance: 0,
      minutesPlayed: game.durationInMinutes ? game.durationInMinutes * 5 : 0,
    }),
  ]);

  // create player games from game summary data
  const homePlayersThatPlayedInGame = gameSummaryData.home.players.filter((player) => player.played === true);
  const awayPlayersThatPlayedInGame = gameSummaryData.away.players.filter((player) => player.played === true);

  for (const player of homePlayersThatPlayedInGame) {
    const { playerGameCreateData, playerSeason } = await preparePlayerGameSummaryToPlayerGameAndPlayerSeason({
      playerGameSummary: player,
      gameId: game.id,
      seasonId: game.seasonId,
      teamSeasonId: game.homeTeamId,
      teamPossessionCount: gameSummaryData.home.statistics.possessions,
      opponentPossessionCount: gameSummaryData.away.statistics.possessions,
      teamGameDuration: gameSummaryData.home.statistics.minutes,
    });
    await createPlayerGameAndUpdatePlayerSeason(playerGameCreateData, playerSeason);
  }

  for (const player of awayPlayersThatPlayedInGame) {
    const { playerGameCreateData, playerSeason } = await preparePlayerGameSummaryToPlayerGameAndPlayerSeason({
      playerGameSummary: player,
      gameId: game.id,
      seasonId: game.seasonId,
      teamSeasonId: game.awayTeamId,
      teamPossessionCount: gameSummaryData.away.statistics.possessions,
      opponentPossessionCount: gameSummaryData.home.statistics.possessions,
      teamGameDuration: gameSummaryData.away.statistics.minutes,
    });
    await createPlayerGameAndUpdatePlayerSeason(playerGameCreateData, playerSeason);
  }

  // create coach games from game summary data
  const [homeHeadCoachCreateGameData, awayHeadCoachCreateGameData] = await Promise.all([
    prepareGameSummaryCoachesDataToHeadCoachGame({
      coachesData: gameSummaryData.home.coaches,
      teamSeasonId: game.homeTeamId,
      gameId: game.id,
    }),
    prepareGameSummaryCoachesDataToHeadCoachGame({
      coachesData: gameSummaryData.away.coaches,
      teamSeasonId: game.awayTeamId,
      gameId: game.id,
    }),
  ]);

  await Promise.all([
    createHeadCoachGame(homeHeadCoachCreateGameData),
    createHeadCoachGame(awayHeadCoachCreateGameData),
  ]);
  // create official games from game summary data
  const officialGamesCreateData = await prepareGameSummaryOfficialsDataToOfficialGame({
    officialsData: gameSummaryData.officials,
    gameId: game.id,
  });
  await createOfficialGames(officialGamesCreateData);
}

async function updateDbFromGameSummary() {
  await appDB.$connect();

  const gameIds = [...octoberGameIds, ...novemberGameIds];

  for (const gameId of gameIds) {
    console.log('Fetching game summary data...');
    console.time(`Game summary data has been fetched`);

    const gameSummaryData = await fetchGameSummary(gameId);

    console.timeEnd(`Game summary data has been fetched`);

    console.log('Updating database from game summary data...');
    console.time(`🌱 Database has been updated from game summary data`);

    await processGameSummaryAndUpdateDb(gameSummaryData);

    console.timeEnd(`🌱 Database has been updated from game summary data`);
  }
}

updateDbFromGameSummary()
  .then(() => {
    console.log('Finished processing all game summary data!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await appDB.$disconnect();
  });
