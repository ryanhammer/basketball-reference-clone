import { Player, Prisma } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function getPlayerByExternalId(externalId: string): Promise<Player | null> {
  return appDB.player.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createPlayer(playerData: Prisma.PlayerCreateInput): Promise<Player> {
  return appDB.player.create({
    data: {
      ...playerData,
    },
  });
}
