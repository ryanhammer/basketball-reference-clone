import { Link } from '@remix-run/react';
import { SingleLinkData } from './top-links-bar';

export function BottomLinksBar(): JSX.Element {
  const linksData: SingleLinkData[] = [
    {
      linkText: 'Players',
      href: '/players',
    },
    {
      linkText: 'Teams',
      href: '/teams',
    },
    {
      linkText: 'Seasons',
      href: '/leagues',
    },
    {
      linkText: 'Leaders',
      href: '/leaders',
    },
    {
      linkText: 'Scores',
      href: '/boxscores',
    },
    {
      linkText: 'WNBA',
      href: '/wnba',
    },
    {
      linkText: 'Draft',
      href: '/wnba',
    },
    {
      linkText: 'Stathead',
      href: 'https://www.stathead.com/',
    },
    {
      linkText: 'Newsletter',
      href: '/email',
    },
    {
      linkText: 'Full Site Menu Below',
      href: '/#site-menu-link',
    },
  ];

  return (
    <div className='flex justify-start bg-off-white border-b-2 border-b-honey-brown'>
      {linksData.map((linkData) => (
        <LinkSection
          linkData={linkData}
          key={linkData.linkText}
          isFullSiteLink={linkData.linkText.includes('Full Site')}
        />
      ))}
    </div>
  );
}

function LinkSection({ linkData, isFullSiteLink }: { linkData: SingleLinkData; isFullSiteLink: boolean }): JSX.Element {
  return (
    <div className='flex text-charcoal font-bold hover:bg-slate-gray hover:text-white px-8 h-8 items-center'>
      <Link to={linkData.href} className='text-sm'>
        {linkData.linkText}
      </Link>
    </div>
  );
}
