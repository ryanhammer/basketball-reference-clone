import { Game, Prisma } from '@prisma/client';
import { platformDB } from '../../prisma';

export async function createGame(gameData: Prisma.GameCreateArgs['data']): Promise<Game> {
  return platformDB.game.create({
    data: gameData,
  });
}
