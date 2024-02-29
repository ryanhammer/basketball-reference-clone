import { PlayerGame, Prisma } from '@prisma/client';
import { appDB } from '../../prisma';

export async function createPlayerGame(playerGameData: Prisma.PlayerGameCreateArgs['data']): Promise<PlayerGame> {
  return appDB.playerGame.create({
    data: playerGameData,
  });
}
