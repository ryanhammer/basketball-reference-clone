import { platformDB } from '../prisma';
import { Team } from '@prisma/client';

export async function getTeamByExternalId(externalId: string): Promise<Team> {
  return platformDB.team.findFirstOrThrow({
    where: {
      externalId,
    },
  });
}
