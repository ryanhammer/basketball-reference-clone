import { Player, Prisma } from '@prisma/client';
import { platformDB } from '../prisma';

export async function getPlayerByExternalId(externalId: string): Promise<Player | null> {
  return platformDB.player.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createPlayer(playerData: Prisma.PlayerCreateInput): Promise<Player> {
  return platformDB.player.create({
    data: {
      ...playerData,
    },
  });
}
