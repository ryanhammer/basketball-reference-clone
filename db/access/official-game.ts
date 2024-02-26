import { Prisma } from '@prisma/client';
import { platformDB } from '../prisma';

export async function createOfficialGames(officialGameData: Prisma.OfficialGameCreateManyArgs['data']): Promise<void> {
  await platformDB.officialGame.createMany({
    data: officialGameData,
  });
}
