import { Prisma } from '@prisma/client';
import { utcToZonedTime, format } from 'date-fns-tz';
import { GameSummary, Venue as SportradarVenue } from '../types/sportrader';
import { getSeasonByLeagueYearAndType } from '../../db/access/season';
import { getTeamByExternalId } from '../../db/access/team';
import { createVenue, getVenueByExternalId } from '../../db/access/venue';

export async function prepareGameSummaryToGame(
  gameSummary: GameSummary,
  leagueId: string
): Promise<Prisma.GameCreateArgs['data']> {
  const season = await getSeasonByLeagueYearAndType({ leagueId, year: 2023, type: 'REG' });
  const [homeTeam, awayTeam] = await Promise.all([
    getTeamByExternalId(gameSummary.home.id),
    getTeamByExternalId(gameSummary.away.id),
  ]);
  let venue = await getVenueByExternalId(gameSummary.venue.id);

  if (!venue) {
    const venueCreateData = createVenueData(gameSummary.venue);

    venue = await createVenue(venueCreateData);
  }

  const { id, scheduled, duration, attendance, home, away } = gameSummary;

  let homeTeamOTPoints;
  let awayTeamOTPoints;

  if (home.scoring.length > 4) {
    homeTeamOTPoints = home.scoring.slice(4).reduce((acc, scoring) => acc + scoring.points, 0);
    awayTeamOTPoints = away.scoring.slice(4).reduce((acc, scoring) => acc + scoring.points, 0);
  }

  return {
    externalId: id,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    seasonId: season.id,
    date: format(utcToZonedTime(scheduled, 'America/New_York'), 'EEE, MMM dd, yyyy'),
    scheduledStart: new Date(scheduled),
    duration: Number(duration),
    attendance,
    venueId: venue.id,
    homeTeamPoints: home.points,
    awayTeamPoints: away.points,
    homeTeamQ1Points: home.scoring[0].points,
    homeTeamQ2Points: home.scoring[1].points,
    homeTeamQ3Points: home.scoring[2].points,
    homeTeamQ4Points: home.scoring[3].points,
    homeTeamOTPoints,
    awayTeamQ1Points: away.scoring[0].points,
    awayTeamQ2Points: away.scoring[1].points,
    awayTeamQ3Points: away.scoring[2].points,
    awayTeamQ4Points: away.scoring[3].points,
    awayTeamOTPoints,
    notes: gameSummary.inseason_tournament ? 'Inseason Tournament' : null,
  };
}

function createVenueData({ id, ...rest }: SportradarVenue) {
  return {
    externalId: id,
    ...rest,
  };
}
