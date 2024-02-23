import BasketballRefLogo from './basketball-ref-logo';
import { SearchBar } from './search-bar';
import { TopLinksBar } from './top-links-bar';

export function Header() {
  return (
    <header className='lg:max-w-[960[px]flex flex-col'>
      <TopLinksBar />
      <div className='my-2 flex justify-between'>
        <BasketballRefLogo className='w-64' />
        <SearchBar />
      </div>
    </header>
  );
}
