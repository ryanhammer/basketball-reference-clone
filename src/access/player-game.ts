import { PlayerGame, Prisma } from '@prisma/client';
import { platformDB } from '../../prisma';

export async function createPlayerGame(playerGameData: Prisma.PlayerGameCreateArgs['data']): Promise<PlayerGame> {
  return platformDB.playerGame.create({
    data: playerGameData,
  });
}
