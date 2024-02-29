import { Coach } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function getCoachByExternalId(externalId: string): Promise<Coach | null> {
  return appDB.coach.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createCoach(coachData: { externalId: string; fullName: string }): Promise<Coach> {
  return appDB.coach.create({
    data: coachData,
  });
}
