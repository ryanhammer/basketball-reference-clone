import BasketballRefLogo from './basketball-ref-logo';
import { SportsReferenceLinksBar } from './sports-reference-links-bar';

export function Header({ className }: { className?: string }) {
  return (
    <header className='lg:max-w-[960[px] py-2 flex flex-col'>
      <SportsReferenceLinksBar />
      <div>
        <BasketballRefLogo className='w-64' />
      </div>
    </header>
  );
}
