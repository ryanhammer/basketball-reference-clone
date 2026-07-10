import type { Route } from '.react-router/types/src/web/routes/+types/_index';
import { getCurrentNBARegularSeason } from '../../access/app-db/season';
import { getStandingsForSeason } from '../../access/app-db/team-season';
import { HomepageGrid } from '../components/homepage-grid';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Basketball Reference' }, { name: 'description', content: 'Basketball Stats and History' }];
};

export async function loader() {
  const season = await getCurrentNBARegularSeason();
  const standings = await getStandingsForSeason(season.id);
  return { standings, year: season.year };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div className='px-3' style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <p className='text-sm my-2'>
        <span className='font-bold'>Basketball Stats and History</span> Statistics, scores, and history for the NBA,
        ABA, WNBA, and top European competition.
      </p>
      <HomepageGrid standings={loaderData.standings} year={loaderData.year} />
    </div>
  );
}
