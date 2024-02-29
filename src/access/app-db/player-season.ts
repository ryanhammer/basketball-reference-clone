import { PlayerSeason, Prisma } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function getPlayerSeasonByPlayerIdAndTeamSeasonId({
  playerId,
  teamSeasonId,
}: { playerId: string; teamSeasonId: string }): Promise<PlayerSeason | null> {
  return appDB.playerSeason.findFirst({
    where: {
      playerId,
      teamSeasonId,
    },
  });
}

export async function createPlayerSeason(
  playerSeasonData: Prisma.PlayerSeasonCreateArgs['data']
): Promise<PlayerSeason> {
  return appDB.playerSeason.create({
    data: playerSeasonData,
  });
}

export async function updatePlayerSeasonJerseyNumbers(
  playerSeasonId: string,
  jerseyNumbers: number[]
): Promise<PlayerSeason> {
  return appDB.playerSeason.update({
    where: {
      id: playerSeasonId,
    },
    data: {
      jerseyNumbers,
    },
  });
}

export async function updatePlayerSeason(
  playerSeasonId: string,
  playerSeasonData: Prisma.PlayerSeasonUpdateArgs['data']
): Promise<PlayerSeason> {
  return appDB.playerSeason.update({
    where: {
      id: playerSeasonId,
    },
    data: playerSeasonData,
  });
}
