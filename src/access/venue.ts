import { Prisma, Venue } from '@prisma/client';
import { platformDB } from '../../prisma';

export async function getVenueByExternalId(externalId: string): Promise<Venue | null> {
  return platformDB.venue.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createVenue(venueData: Prisma.VenueCreateArgs['data']): Promise<Venue> {
  return platformDB.venue.create({
    data: venueData,
  });
}
