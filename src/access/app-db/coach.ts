import { Coach } from '@prisma/client';
import { platformDB } from '../../../prisma';

export async function getCoachByExternalId(externalId: string): Promise<Coach | null> {
  return platformDB.coach.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createCoach(coachData: { externalId: string; fullName: string }): Promise<Coach> {
  return platformDB.coach.create({
    data: coachData,
  });
}
