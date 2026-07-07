import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),

  // League season pages — e.g. /leagues/NBA/2024
  route('leagues/:leagueAbbrev/:year', 'routes/leagues.$leagueAbbrev.$year.tsx'),

  // Team pages — e.g. /teams/LAL/2024
  route('teams/:teamId/:year', 'routes/teams.$teamId.$year.tsx'),

  // Player pages — e.g. /players/jamesle01
  route('players/:playerId', 'routes/players.$playerId.tsx'),
] satisfies RouteConfig;
