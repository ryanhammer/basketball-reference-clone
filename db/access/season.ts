import { platformDB } from '../prisma';
import { Season, SeasonType } from '@prisma/client';

export async function getSeasonByLeagueYearAndType(leagueId: string, year: number, type: SeasonType): Promise<Season> {
  return platformDB.season.findFirstOrThrow({
    where: {
      leagueId,
      year,
      type,
    },
  });
}
