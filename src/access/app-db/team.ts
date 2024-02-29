import { Team } from '@prisma/client';
import { appDB } from '../../prisma';

export async function getTeamByExternalId(externalId: string): Promise<Team> {
  return appDB.team.findFirstOrThrow({
    where: {
      externalId,
    },
  });
}
