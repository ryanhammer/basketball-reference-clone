import { Game, Prisma } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function createGame(gameData: Prisma.GameCreateArgs['data']): Promise<Game> {
  return appDB.game.create({
    data: gameData,
  });
}
