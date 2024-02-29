import { appDB } from '.';
import { franchiseData, teamData, Abbreviation } from '../public/data/team-data';
import { venueData, teamVenueData } from '../public/data/venue-data';
import { playerData } from '../public/data/player-data';
import { determinePlayerBirthplaceInfo } from '../src/utils/model-utils';
import { Prisma } from '@prisma/client';

async function seed() {
  console.log('🌱 Seeding...');
  console.time(`🌱 Database has been seeded`);

  await appDB.$connect();

  if (process.env.NODE_ENV !== 'development') {
    throw Error('You can not run this script outside of your local development environment');
  }

  const leagueData = {
    name: 'National Basketball Association',
    abbreviation: 'NBA',
    isActive: true,
    inauguralSeason: '1949-50',
  };

  const league = await appDB.league.create({ data: leagueData });

  const teamPartialCreateManyInput: Omit<Prisma.TeamCreateArgs['data'], 'franchiseId'>[] = [];

  const franchiseCreateManyInput: Prisma.FranchiseCreateManyArgs['data'] = franchiseData.map((franchise) => {
    const { externalId, ...rest } = franchise;

    teamPartialCreateManyInput.push({
      name: franchise.name,
      abbreviation: franchise.abbreviation,
      isActive: franchise.isActive,
      inauguralSeason: teamData[franchise.abbreviation],
      externalId,
      league: 'NBA',
    });

    return {
      ...rest,
      leagueId: league.id,
    };
  });

  await appDB.franchise.createMany({ data: franchiseCreateManyInput });

  interface TeamLevelData {
    franchiseId: string;
    teamSeasonId: string;
    venueId: string;
  }
  const teamLevelData: { [key in Abbreviation]: TeamLevelData } = {} as never;

  (await appDB.franchise.findMany()).map((franchise) => {
    teamLevelData[franchise.abbreviation as Abbreviation] = {
      franchiseId: franchise.id,
      teamSeasonId: '',
      venueId: '',
    };
  });

  await appDB.team.createMany({
    data: teamPartialCreateManyInput.map((team) => ({
      ...team,
      franchiseId: teamLevelData[team.abbreviation as Abbreviation].franchiseId,
    })),
  });

  await appDB.venue.createMany({ data: venueData });

  const season = await appDB.season.create({
    data: {
      year: 2023,
      startDate: '2023-10-24',
      endDate: '2024-04-14',
      leagueId: league.id,
      isCurrent: true,
      type: 'REG',
      externalId: 'f1162fd1-29c5-4c29-abb4-57b78f16d238',
    },
  });

  await appDB.season.createMany({
    data: [
      {
        year: 2023,
        startDate: '2023-10-05',
        endDate: '2023-10-20',
        leagueId: league.id,
        isCurrent: false,
        type: 'PRE',
        externalId: '0d858257-7bc3-435d-9e54-1c8590be84ce',
      },
      {
        year: 2023,
        startDate: '2023-12-09',
        endDate: '2023-12-10',
        leagueId: league.id,
        isCurrent: false,
        type: 'IST',
        externalId: '170cfa7b-54e8-468b-ab9f-21244769bd75',
      },
      {
        year: 2023,
        startDate: '2024-04-16',
        endDate: '2024-04-19',
        leagueId: league.id,
        isCurrent: false,
        type: 'PIT',
        externalId: '851f97e4-c830-4590-88e9-e1286383148c',
      },
      {
        year: 2023,
        startDate: '2024-04-20',
        endDate: '2024-06-23',
        leagueId: league.id,
        isCurrent: false,
        type: 'PST',
        externalId: '8905ddd2-e5f0-4734-b9ef-c9c3452b72d2',
      },
    ],
  });

  const teams = await appDB.team.findMany();
  const venues = await appDB.venue.findMany();

  teams.forEach((team) => {
    const teamVenue = venues.find((venue) => venue.externalId === teamVenueData[team.abbreviation as Abbreviation]);
    if (teamVenue) {
      teamLevelData[team.abbreviation as Abbreviation].venueId = teamVenue.id;
    }
  });

  const teamSeasonCreateInput = teams.map((team) => {
    return {
      seasonId: season.id,
      teamId: team.id,
      venueId: teamLevelData[team.abbreviation as Abbreviation].venueId,
      isCurrent: true,
    };
  });

  await appDB.teamSeason.createMany({
    data: teamSeasonCreateInput,
  });

  const teamSeasons = await appDB.teamSeason.findMany({ include: { team: true } });

  teamSeasons.forEach((teamSeason) => {
    teamLevelData[teamSeason.team.abbreviation as Abbreviation].teamSeasonId = teamSeason.id;
  });

  const playerCreateInputWithTeamAndPlayerSeasonInfo = teams.flatMap((team) => {
    const teamPlayerData = playerData[team.abbreviation as Abbreviation];

    const playerCreateNestedDataInput = teamPlayerData.map((player) => {
      return {
        playerCreateInput: {
          fullName: player.full_name,
          firstName: player.first_name,
          lastName: player.last_name,
          position: player.primary_position,
          birthDate: player.birthdate,
          height: player.height,
          weight: player.weight,
          ...determinePlayerBirthplaceInfo(player.birth_place),
          shootingHand: 'right',
          college: player.college,
          draftTeam: player.draft?.team_id,
          draftRound: player.draft ? Number(player.draft?.round) : undefined,
          draftPosition: player.draft ? Number(player.draft?.pick) : undefined,
          externalId: player.id,
        },
        teamSeasonId: teamLevelData[team.abbreviation as Abbreviation].teamSeasonId,
        playerJerseyNumber: player.jersey_number,
      };
    });

    return playerCreateNestedDataInput;
  });

  await appDB.player.createMany({
    data: playerCreateInputWithTeamAndPlayerSeasonInfo.map(
      (playerNestedCreateInput) => playerNestedCreateInput.playerCreateInput
    ),
  });

  const players = await appDB.player.findMany();

  const playerSeasonCreateManyInput = players.map((player) => {
    const teamSeasonId = playerCreateInputWithTeamAndPlayerSeasonInfo.find(
      (p) => p.playerCreateInput.externalId === player.externalId
    )?.teamSeasonId;

    if (!teamSeasonId) {
      throw Error(`Team season id not found for player with ID: ${player.id}`);
    }
    const jerseyNumbers = playerCreateInputWithTeamAndPlayerSeasonInfo.find(
      (p) => p.playerCreateInput.externalId === player.externalId
    )?.playerJerseyNumber
      ? [
          Number(
            playerCreateInputWithTeamAndPlayerSeasonInfo.find(
              (p) => p.playerCreateInput.externalId === player.externalId
            )?.playerJerseyNumber
          ),
        ]
      : [];

    return {
      playerId: player.id,
      teamSeasonId,
      jerseyNumbers,
      isTwoWayContract: false,
      seasonId: season.id,
    };
  });

  await appDB.playerSeason.createMany({ data: playerSeasonCreateManyInput });

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await appDB.$disconnect();
  });
