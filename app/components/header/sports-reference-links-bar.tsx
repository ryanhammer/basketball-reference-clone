import { Link } from '@remix-run/react';

interface SingleLinkData {
  linkText: string;
  href: string;
}

interface MultipleLinksData {
  linksText: string[];
  hrefs: string[];
}

type LinksData = SingleLinkData | MultipleLinksData;

export function SportsReferenceLinksBar(): JSX.Element {
  const linksData: LinksData[] = [
    {
      linkText: 'Baseball',
      href: 'https://www.baseball-reference.com/',
    },
    {
      linksText: ['Football', '(college)'],
      hrefs: ['https://www.pro-football-reference.com/', 'https://www.sports-reference.com/cfb/'],
    },
    {
      linksText: ['Basketball', '(college)'],
      hrefs: ['/', 'https://www.sports-reference.com/cbb/'],
    },
    {
      linkText: 'Hockey',
      href: 'https://www.hockey-reference.com/',
    },
    {
      linkText: 'Fußball',
      href: 'https://www.fbref.com/',
    },
    {
      linkText: 'Blog',
      href: 'https://www.sports-reference.com/blog/',
    },
    {
      linkText: 'Stathead ®',
      href: 'https://www.stathead.com/',
    },
    {
      linkText: 'Immaculate Grid',
      href: 'https://www.immaculate-grid.com/',
    },
  ];

  return (
    <div className='flex justify-between bg-slate-gray py-1'>
      <div>
        <div className='border-r-2 border-light-gray'>
          <Link to='https://www.sports-reference.com/' className='flex text-light-gray text-xs'>
            <img src='sports-ref-logo.png' alt='Sports Reference' className='w-6 h-5' />
            {' Sports Reference ®'}
          </Link>
        </div>
      </div>
    </div>
  );
}
