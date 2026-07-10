import { Link } from 'react-router';
import type { StandingEntry } from '../../../access/app-db/team-season';
import { NBA_CONFERENCES } from '../../../utils/nba-conferences';

type Props = {
  className?: string;
  standings: StandingEntry[];
  year: number;
};

type ConferenceTableProps = {
  conference: 'East' | 'West';
  rows: StandingEntry[];
  year: number;
};

function ConferenceTable({ conference, rows, year }: ConferenceTableProps) {
  return (
    <table className='w-full text-xs border-collapse'>
      <thead>
        <tr className='bg-[#c9daf3]'>
          <th className='text-left font-semibold py-0.5 px-1' colSpan={2}>
            {conference}
          </th>
          <th className='text-right font-semibold py-0.5 px-1'>W</th>
          <th className='text-right font-semibold py-0.5 px-1'>L</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((ts, i) => (
          <tr key={ts.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f0f0f0]'}>
            <td className='py-0.5 px-1 text-right text-gray-500 w-5'>{i + 1}</td>
            <td className='py-0.5 px-1'>
              <Link
                to={`/teams/${ts.team.abbreviation}/${year}`}
                className='text-[#1155cc] hover:underline font-medium'
              >
                {ts.team.abbreviation}
              </Link>
            </td>
            <td className='py-0.5 px-1 text-right'>{ts.gamesWon}</td>
            <td className='py-0.5 px-1 text-right'>{ts.gamesLost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function EveryTeamContainer({ className, standings, year }: Props) {
  const eastStandings = standings.filter(
    (ts) => NBA_CONFERENCES[ts.team.abbreviation] === 'East',
  );
  const westStandings = standings.filter(
    (ts) => NBA_CONFERENCES[ts.team.abbreviation] === 'West',
  );
  const displayYear = `${year}-${String(year + 1).slice(-2)}`;

  return (
    <div className={className}>
      <h2 className='text-lg font-bold border-b border-gray-300 pb-0.5 mb-1'>
        <Link to='/teams/' className='hover:underline'>
          Every NBA Team
        </Link>
      </h2>
      <h3 className='text-sm font-semibold mb-1'>{displayYear} NBA Standings</h3>
      <div className='grid grid-cols-2 gap-2'>
        <ConferenceTable conference='East' rows={eastStandings} year={year} />
        <ConferenceTable conference='West' rows={westStandings} year={year} />
      </div>
    </div>
  );
}
