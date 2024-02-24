import type { MetaFunction } from '@remix-run/node';
import { HomepageGrid } from '../components/homepage-grid';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }} className='px-3'>
      <p className='text-sm my-2'>
        <span className='font-bold'>Basketball Stats and History</span> Statistics, scores, and history for the NBA,
        ABA, WNBA, and top European competition.
      </p>
      <HomepageGrid />
    </div>
  );
}
