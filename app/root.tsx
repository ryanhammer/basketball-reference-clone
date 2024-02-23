import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindStylesheet from './index.css?url';
import { Header } from './components/header';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex justify-center bg-light-gray min-h-screen'>
          <div className='bg-white xl:w-[1476px] shadow-md mx-auto'>
            <Header />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
          </div>
        </div>
      </body>
    </html>
  );
}
