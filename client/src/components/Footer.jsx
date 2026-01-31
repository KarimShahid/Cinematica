import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-200 bg-ink-100/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link to="/" className="font-serif text-2xl font-semibold text-ink-950">
            Cinematica
          </Link>
          <div className="flex gap-8">
            <Link
              to="/"
              className="font-sans text-sm text-ink-600 hover:text-ink-950 transition-colors"
            >
              Movies
            </Link>
            <Link
              to="/"
              className="font-sans text-sm text-ink-600 hover:text-ink-950 transition-colors"
            >
              TV Series
            </Link>
            <Link
              to="/"
              className="font-sans text-sm text-ink-600 hover:text-ink-950 transition-colors"
            >
              Reviews
            </Link>
            <Link
              to="/"
              className="font-sans text-sm text-ink-600 hover:text-ink-950 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
        <p className="font-sans text-sm text-ink-500 mt-8 text-center sm:text-left">
          © {new Date().getFullYear()} Cinematica. Movie data from{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-600 hover:underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
