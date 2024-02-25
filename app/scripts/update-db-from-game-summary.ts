import { createGame } from '../../db/access/game';
import { getLeagueByName } from '../../db/access/league';
import { octoberGameIds, novemberGameIds } from '../../public/data/game-data-2023-season';
import { GameSummary } from '../types/sportrader';
import { prepareGameSummaryToGame } from '../utils/sportradar-data-helpers';

async function fetchGameSummary(gameId: string): Promise<GameSummary> {
  const apiUrl = `http://api.sportradar.us/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${process.env.SPORTRADAR_API_KEY}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data as GameSummary;
}

async function processGameSummary(gameSummaryData: GameSummary) {
  // create game from game summary data
  const league = await getLeagueByName('NBA');
  const gameCreateData = await prepareGameSummaryToGame(gameSummaryData, league.id);
  const game = await createGame(gameCreateData);

  // create team games from game summary data
  // create player games from game summary data
  // return object with game, team games, and player games
}

async function updateDbFromGameSummary(gameSummaryData: GameSummary) {
  console.log('🌱 Updating database from game summary data...');
  console.time(`🌱 Database has been updated from game summary data`);
  console.log(octoberGameIds);
  console.log(novemberGameIds);
  console.timeEnd(`🌱 Database has been updated from game summary data`);
}
