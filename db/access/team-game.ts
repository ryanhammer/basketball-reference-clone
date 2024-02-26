import { TeamGame } from '@prisma/client';
import { platformDB } from '../prisma';

export async function getTeamGameByTeamSeasonIdAndGameId({
  teamSeasonId,
  gameId,
}: { teamSeasonId: string; gameId: string }): Promise<TeamGame> {
  return platformDB.teamGame.findFirstOrThrow({
    where: {
      teamSeasonId,
      gameId,
    },
  });
}
