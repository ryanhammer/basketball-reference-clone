import { Season, SeasonType } from '@prisma/client';
import { appDB } from '../../prisma';

export async function getSeasonByLeagueYearAndType({
  leagueId,
  year,
  type,
}: { leagueId: string; year: number; type: SeasonType }): Promise<Season> {
  return appDB.season.findFirstOrThrow({
    where: {
      leagueId,
      year,
      type,
    },
  });
}
