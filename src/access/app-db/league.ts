import { League } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function getLeagueById(leagueId: string): Promise<League | null> {
  return appDB.league.findUnique({
    where: {
      id: leagueId,
    },
  });
}

export async function getLeagueByAbbreviation(leagueAbbreviation: string): Promise<League> {
  return appDB.league.findUniqueOrThrow({
    where: {
      abbreviation: leagueAbbreviation,
    },
  });
}
