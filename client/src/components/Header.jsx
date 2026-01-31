import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink-50/95 backdrop-blur-sm border-b border-ink-200/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl sm:text-3xl font-semibold text-ink-950 tracking-tight">
            Cinematica
          </span>
        </Link>
        <div className="flex items-center gap-6 sm:gap-10">
          <Link
            to="/"
            className="font-sans text-sm font-medium text-ink-700 hover:text-gold-600 transition-colors"
          >
            Movies
          </Link>
          <Link
            to="/"
            className="font-sans text-sm font-medium text-ink-700 hover:text-gold-600 transition-colors"
          >
            TV Series
          </Link>
          <Link
            to="/"
            className="font-sans text-sm font-medium text-ink-600 hover:text-gold-600 transition-colors"
          >
            Reviews
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 font-sans text-sm font-medium text-ink-700 hover:text-gold-600 transition-colors px-4 py-2 rounded-lg hover:bg-ink-100"
              >
                <div className="w-8 h-8 rounded-full bg-gold-600 text-white flex items-center justify-center font-semibold text-xs">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user?.name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-ink-200 py-2 z-10">
                  <div className="px-4 py-2 border-b border-ink-200">
                    <p className="font-sans text-sm font-medium text-ink-900">{user?.name}</p>
                    <p className="font-sans text-xs text-ink-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 font-sans text-sm text-ink-700 hover:bg-ink-50 hover:text-gold-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="font-sans text-sm font-medium px-4 py-2 text-gold-600 hover:text-gold-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="font-sans text-sm font-semibold px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
