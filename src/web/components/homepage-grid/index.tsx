import type { StandingEntry } from '../../../access/app-db/team-season';
import { EveryPlayerContainer } from './every-player-container';
import { EveryTeamContainer } from './every-team-container';
import { StatheadBasketballContainer } from './stathead-basketball-container';

type Props = {
  standings: StandingEntry[];
  year: number;
};

export function HomepageGrid({ standings, year }: Props) {
  return (
    <div className='lg:grid lg:grid-cols-3 gap-4'>
      <EveryPlayerContainer className='shadow-lg' />
      <EveryTeamContainer className='shadow-lg' standings={standings} year={year} />
      <StatheadBasketballContainer className='shadow-lg' />
    </div>
  );
}
