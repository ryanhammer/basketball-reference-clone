import { useState, FormEvent } from 'react';

export function SearchBar(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className='flex justify-center items-center space-x-4 mr-4'>
      <input
        type='text'
        placeholder='Enter Person, Team, Section, etc'
        className='py-2 px-4 border-2 border-light-gray focus:outline-none focus:border-gray-500 w-[28rem] h-8'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type='submit'
        className='bg-honey-brown border-1 border-light-gray hover:underline text-white font-bold px-4 h-8 rounded-md w-40 transition'
      >
        Search
      </button>
    </form>
  );
}
