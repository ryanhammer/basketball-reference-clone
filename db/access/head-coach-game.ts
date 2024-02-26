import { HeadCoachGame, Prisma } from '@prisma/client';
import { platformDB } from '../prisma';

export async function createHeadCoachGame(
  headCoachGameData: Prisma.HeadCoachGameCreateArgs['data']
): Promise<HeadCoachGame> {
  return platformDB.headCoachGame.create({
    data: headCoachGameData,
  });
}
