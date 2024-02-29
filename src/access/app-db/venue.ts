import { Prisma, Venue } from '@prisma/client';
import { appDB } from '../../../prisma';

export async function getVenueByExternalId(externalId: string): Promise<Venue | null> {
  return appDB.venue.findFirst({
    where: {
      externalId,
    },
  });
}

export async function createVenue(venueData: Prisma.VenueCreateArgs['data']): Promise<Venue> {
  return appDB.venue.create({
    data: venueData,
  });
}
