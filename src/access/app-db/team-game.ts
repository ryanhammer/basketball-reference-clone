import { TeamGame } from '@prisma/client';
import { appDB } from '../../prisma';

export async function getTeamGameByTeamSeasonIdAndGameId({
  teamSeasonId,
  gameId,
}: { teamSeasonId: string; gameId: string }): Promise<TeamGame> {
  return appDB.teamGame.findFirstOrThrow({
    where: {
      teamSeasonId,
      gameId,
    },
  });
}
