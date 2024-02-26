import { Player } from '@prisma/client';
import { platformDB } from '../prisma';

export async function getPlayerByExternalId(externalId: string): Promise<Player> {
  return platformDB.player.findFirstOrThrow({
    where: {
      externalId,
    },
  });
}
