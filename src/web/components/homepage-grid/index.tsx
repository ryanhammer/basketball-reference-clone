import { EveryPlayerContainer } from './every-player-container';
import { EveryTeamContainer } from './every-team-container';
import { StatheadBasketballContainer } from './stathead-basketball-container';

export function HomepageGrid(): JSX.Element {
  return (
    <div className='lg:grid lg:grid-cols-3 gap-4'>
      <EveryPlayerContainer className='shadow-lg' />
      <EveryTeamContainer className='shadow-lg' />
      <StatheadBasketballContainer className='shadow-lg' />
    </div>
  );
}
