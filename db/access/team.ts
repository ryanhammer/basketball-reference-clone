import { Team } from '@prisma/client';
import { platformDB } from '../prisma';

export async function getTeamByExternalId(externalId: string): Promise<Team> {
  return platformDB.team.findFirstOrThrow({
    where: {
      externalId,
    },
  });
}
