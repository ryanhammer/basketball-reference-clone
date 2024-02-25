import { PlayerSeason, Prisma } from '@prisma/client';
import { platformDB } from '../prisma';

export async function getPlayerSeasonByPlayerIdAndTeamSeasonId({
  playerId,
  teamSeasonId,
}: { playerId: string; teamSeasonId: string }): Promise<PlayerSeason | null> {
  return platformDB.playerSeason.findFirst({
    where: {
      playerId,
      teamSeasonId,
    },
  });
}

export async function createPlayerSeason(
  playerSeasonData: Prisma.PlayerSeasonCreateArgs['data']
): Promise<PlayerSeason> {
  return platformDB.playerSeason.create({
    data: playerSeasonData,
  });
}

export async function updatePlayerSeasonJerseyNumbers(
  playerSeasonId: string,
  jerseyNumbers: number[]
): Promise<PlayerSeason> {
  return platformDB.playerSeason.update({
    where: {
      id: playerSeasonId,
    },
    data: {
      jerseyNumbers,
    },
  });
}
