import { Official, Prisma } from '@prisma/client';
import { platformDB } from '../../../prisma';

export async function getOfficialByExternalId(externalId: string): Promise<Official | null> {
  return platformDB.official.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createOfficial(officialData: Prisma.OfficialCreateArgs['data']): Promise<Official> {
  return platformDB.official.create({
    data: officialData,
  });
}
