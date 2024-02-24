import { platformDB } from '../prisma';
import { League } from '@prisma/client';

export async function getLeagueById(leagueId: string): Promise<League | null> {
  return platformDB.league.findUnique({
    where: {
      id: leagueId,
    },
  });
}

export async function getLeagueByName(leagueName: string): Promise<League> {
  return platformDB.league.findUniqueOrThrow({
    where: {
      name: leagueName,
    },
  });
}
