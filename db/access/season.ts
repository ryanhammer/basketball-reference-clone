import { Season, SeasonType } from '@prisma/client';
import { platformDB } from '../../prisma';

export async function getSeasonByLeagueYearAndType({
  leagueId,
  year,
  type,
}: { leagueId: string; year: number; type: SeasonType }): Promise<Season> {
  return platformDB.season.findFirstOrThrow({
    where: {
      leagueId,
      year,
      type,
    },
  });
}
