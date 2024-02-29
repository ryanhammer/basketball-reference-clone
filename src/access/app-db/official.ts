import { Official, Prisma } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function getOfficialByExternalId(externalId: string): Promise<Official | null> {
  return appDB.official.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createOfficial(officialData: Prisma.OfficialCreateArgs['data']): Promise<Official> {
  return appDB.official.create({
    data: officialData,
  });
}
