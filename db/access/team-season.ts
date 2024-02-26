import { Prisma, TeamSeason } from '@prisma/client';
import { platformDB } from '../prisma';

export async function getTeamSeasonByTeamIdAndSeasonId(teamId: string, seasonId: string): Promise<TeamSeason> {
  return platformDB.teamSeason.findFirstOrThrow({
    where: {
      teamId,
      seasonId,
    },
  });
}

export async function updateTeamSeason(
  teamSeasonId: string,
  teamSeasonData: Prisma.TeamSeasonUpdateArgs['data']
): Promise<TeamSeason> {
  return platformDB.teamSeason.update({
    where: {
      id: teamSeasonId,
    },
    data: teamSeasonData,
  });
}
