import { platformDB } from './';
import { franchiseData, teamData, Abbreviation } from '../../public/data/team-data';
import { venueData, teamVenueData } from '../../public/data/venue-data';
import { playerData } from '../../public/data/player-data';
import { determinePlayerBirthplaceInfo } from '../../app/utils/model-utils';

async function seed() {
  console.log('🌱 Seeding...');
  console.time(`🌱 Database has been seeded`);

  await platformDB.$connect();

  if (process.env.NODE_ENV !== 'development') {
    throw Error('You can not run this script outside of your local development environment');
  }

  const leagueData = {
    name: 'National Basketball Association',
    abbreviation: 'NBA',
    isActive: true,
    inauguralSeason: '1949-50',
  };

  const league = await platformDB.league.create({ data: leagueData });

  await Promise.all(
    franchiseData.map((franchise) => {
      platformDB.franchise.create({
        data: {
          ...franchise,
          leagueId: league.id,
          teams: {
            createMany: {
              data: [
                {
                  name: franchise.name,
                  abbreviation: franchise.abbreviation,
                  isActive: franchise.isActive,
                  inauguralSeason: teamData[franchise.abbreviation],
                  externalId: franchise.externalId,
                  league: 'NBA',
                },
              ],
            },
          },
        },
      });
    })
  );

  await platformDB.venue.createMany({ data: venueData });

  const teams = await platformDB.team.findMany();

  const season = await platformDB.season.create({
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

  await platformDB.season.createMany({
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

  const teamSeasonCreateInput = await Promise.all(
    teams.map(async (team) => {
      const teamVenue = await platformDB.venue.findFirst({
        where: { externalId: teamVenueData[team.abbreviation as Abbreviation] },
      });

      if (teamVenue) {
        return {
          seasonId: season.id,
          teamId: team.id,
          venueId: teamVenue.id,
          isCurrent: true,
        };
      }

      throw Error(`Unable to find venue ID for team ${team.abbreviation}`);
    })
  );

  await platformDB.teamSeason.createMany({
    data: teamSeasonCreateInput,
  });

  const playerCreateInputWithTeamAndPlayerSeasonInfo = (
    await Promise.all(
      teams.map(async (team) => {
        const teamPlayerData = playerData[team.abbreviation as Abbreviation];
        const teamSeason = await platformDB.teamSeason.findFirstOrThrow({
          where: { teamId: team.id, seasonId: season.id },
        });

        const playerCreateNestedDataInput = teamPlayerData.map((player) => {
          return {
            playerCreateInput: {
              fullName: player.full_name,
              firstName: player.first_name,
              lastName: player.last_name,
              position: player.primary_position,
              birthDate: player.birthdate,
              height: player.height.toString(),
              weight: player.weight,
              ...determinePlayerBirthplaceInfo(player.birth_place),
              shootingHand: 'right',
              college: player.college,
              draftTeam: player.draft?.team_id,
              draftRound: player.draft ? Number(player.draft?.round) : undefined,
              draftPosition: player.draft ? Number(player.draft?.pick) : undefined,
              externalId: player.id,
            },
            teamSeasonId: teamSeason.id,
            playerJerseyNumber: player.jersey_number,
          };
        });

        return playerCreateNestedDataInput;
      })
    )
  ).flat();

  await Promise.all(
    playerCreateInputWithTeamAndPlayerSeasonInfo.map((playerNestedCreateInput) => {
      platformDB.player.create({
        data: {
          ...playerNestedCreateInput.playerCreateInput,
          playerSeasons: {
            create: {
              teamSeasonId: playerNestedCreateInput.teamSeasonId,
              jerseyNumbers: playerNestedCreateInput.playerJerseyNumber
                ? [Number(playerNestedCreateInput.playerJerseyNumber)]
                : [],
              isTwoWayContract: false,
              seasonId: season.id,
            },
          },
        },
      });
    })
  );

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await platformDB.$disconnect();
  });
