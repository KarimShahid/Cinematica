import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <label htmlFor="search" className="sr-only">
          Search movies and TV series
        </label>
        <div className="relative">
          <input
            id="search"
            type="search"
            placeholder="Search movies, series, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 font-sans text-ink-900 bg-white border border-ink-200 rounded-xl shadow-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
