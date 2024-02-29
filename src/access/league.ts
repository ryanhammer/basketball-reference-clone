import { League } from '@prisma/client';
import { platformDB } from '../../prisma';

export async function getLeagueById(leagueId: string): Promise<League | null> {
  return platformDB.league.findUnique({
    where: {
      id: leagueId,
    },
  });
}

export async function getLeagueByAbbreviation(leagueAbbreviation: string): Promise<League> {
  return platformDB.league.findUniqueOrThrow({
    where: {
      abbreviation: leagueAbbreviation,
    },
  });
}
