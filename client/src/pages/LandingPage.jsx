import { useState, useEffect } from 'react';
import {
  getConfiguration,
  getTrendingMovies,
  getPopularMovies,
  getNowPlaying,
} from '../api/tmdb';
import Header from '../components/Header';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Footer from '../components/Footer';

export default function LandingPage() {
  const [config, setConfig] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [configRes, trendingRes, popularRes, nowPlayingRes] =
          await Promise.all([
            getConfiguration(),
            getTrendingMovies(),
            getPopularMovies(),
            getNowPlaying(),
          ]);

        setConfig(configRes?.images || {});
        setTrending(trendingRes?.results?.slice(0, 1) || []);
        setPopular(popularRes?.results?.slice(0, 12) || []);
        setNowPlaying(nowPlayingRes?.results?.slice(0, 12) || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-ink-500 text-sm">Loading Cinematica...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero config={config} featured={trending[0]} />
        <StatsBar />
        <SearchBar />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 mb-2">
            Popular Now
          </h2>
          <p className="font-sans text-ink-500 mb-10 text-lg">
            Discover what everyone is watching and share your review
          </p>
          <MovieGrid movies={popular} config={config} />
        </section>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 bg-ink-100/50">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 mb-2">
            In Theaters
          </h2>
          <p className="font-sans text-ink-500 mb-10 text-lg">
            Catch these films on the big screen
          </p>
          <MovieGrid movies={nowPlaying} config={config} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
