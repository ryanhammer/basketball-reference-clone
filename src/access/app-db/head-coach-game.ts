import { HeadCoachGame, Prisma } from '@prisma/client';
import { appDB } from '../../prisma';

export async function createHeadCoachGame(
  headCoachGameData: Prisma.HeadCoachGameCreateArgs['data']
): Promise<HeadCoachGame> {
  return appDB.headCoachGame.create({
    data: headCoachGameData,
  });
}
