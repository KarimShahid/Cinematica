import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, getConfiguration } from '../api/tmdb';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieGrid from '../components/MovieGrid';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadResults() {
      if (!query) {
        setError('No search query provided');
        setLoading(false);
        return;
      }

      try {
        const [configRes, resultsRes] = await Promise.all([
          getConfiguration(),
          searchMovies(query),
        ]);

        setConfig(configRes?.images || {});
        setMovies(resultsRes?.results || []);
      } catch (err) {
        setError('Failed to load search results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="font-serif text-4xl font-semibold text-ink-900 mb-2">
            Search Results
          </h1>
          <p className="font-sans text-ink-600 mb-8">
            {query && `Results for "${query}"`}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-sans text-ink-500 text-sm">Searching...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="font-sans text-red-700">{error}</p>
            </div>
          ) : movies.length > 0 ? (
            <>
              <p className="font-sans text-ink-500 mb-6">
                Found {movies.length} result{movies.length !== 1 ? 's' : ''}
              </p>
              <MovieGrid movies={movies} config={config} />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="font-sans text-ink-500 text-lg">
                No movies found for "{query}"
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
