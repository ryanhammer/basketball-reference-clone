import { Prisma, TeamSeason } from '@prisma/client';
import { appDB } from '../../prisma';

const standingsSelect = {
  id: true,
  gamesWon: true,
  gamesLost: true,
  team: { select: { id: true, name: true, abbreviation: true } },
} satisfies Prisma.TeamSeasonSelect;

export type StandingEntry = Prisma.TeamSeasonGetPayload<{ select: typeof standingsSelect }>;

export async function getStandingsForSeason(seasonId: string): Promise<StandingEntry[]> {
  return appDB.teamSeason.findMany({
    where: { seasonId },
    select: standingsSelect,
    orderBy: { gamesWon: 'desc' },
  });
}

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
