import { Prisma } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function createOfficialGames(officialGameData: Prisma.OfficialGameCreateManyArgs['data']): Promise<void> {
  await appDB.officialGame.createMany({
    data: officialGameData,
  });
}
