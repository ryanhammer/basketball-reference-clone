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

export function TopLinksBar(): JSX.Element {
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
    <div className='flex justify-between bg-slate-gray pt-1 pb-1.5 h-6'>
      <div className='flex justify-start'>
        <div className='border-r-[1px] border-light-gray border-opacity-50 pr-2'>
          <Link to='https://www.sports-reference.com/' className='flex text-light-gray text-xs'>
            <img src='sports-ref-logo.png' alt='Sports Reference' className='w-6 h-4' />
            {' Sports Reference ®'}
          </Link>
        </div>
        {linksData.map((linkData, index) => (
          <LinkSection linkData={linkData} key={index} isLastLink={index === linksData.length - 1} />
        ))}
      </div>
    </div>
  );
}

function LinkSection({ linkData, isLastLink }: { linkData: LinksData; isLastLink: boolean }): JSX.Element {
  const borderStyles = isLastLink ? '' : 'border-r-[1px] border-light-gray border-opacity-50';
  if ('linkText' in linkData) {
    return (
      <div className={`flex ${borderStyles} px-2`}>
        <Link to={linkData.href} className='text-light-gray text-xs'>
          {linkData.linkText}
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex ${borderStyles} px-2`}>
      {linkData.linksText.map((linkText, index) => (
        <Link to={linkData.hrefs[index]} className='text-light-gray text-xs' key={linkText}>
          {linkText}
        </Link>
      ))}
    </div>
  );
}
