import { Prisma, TeamSeason } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function getTeamSeasonByTeamIdAndSeasonId(teamId: string, seasonId: string): Promise<TeamSeason> {
  return appDB.teamSeason.findFirstOrThrow({
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
  return appDB.teamSeason.update({
    where: {
      id: teamSeasonId,
    },
    data: teamSeasonData,
  });
}
