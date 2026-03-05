import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getConfiguration } from '../api/tmdb';
import { getMovieReviews } from '../api/reviews';
import Header from '../components/Header';
import Footer from '../components/Footer';

function getImageUrl(config, path) {
  if (!path || !config?.secure_base_url) return null;
  const sizes = config.poster_sizes || [];
  const size = sizes.includes('w500') ? 'w500' : sizes[sizes.length - 1] || 'original';
  return `${config.secure_base_url}${size}${path}`;
}

const API_BASE = '/api';

async function getUserReviews(accessToken) {
  const res = await fetch(`${API_BASE}/my-reviews`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export default function UserReviewsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function loadData() {
      try {
        const [configRes, reviewsRes] = await Promise.all([
          getConfiguration(),
          getUserReviews(accessToken),
        ]);

        setConfig(configRes?.images || {});
        
        // Group reviews by movieId and keep only the latest review for each movie
        const reviewsByMovie = {};
        reviewsRes.forEach((review) => {
          if (!reviewsByMovie[review.movieId] || new Date(review.createdAt) > new Date(reviewsByMovie[review.movieId].createdAt)) {
            reviewsByMovie[review.movieId] = review;
          }
        });
        
        const uniqueReviews = Object.values(reviewsByMovie).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(uniqueReviews);

        // Fetch movie details for each review
        const movieMap = {};
        for (const review of reviewsRes) {
          try {
            const movieDetailsRes = await fetch(`/api/tmdb/movie/${review.movieId}`);
            if (movieDetailsRes.ok) {
              movieMap[review.movieId] = await movieDetailsRes.json();
            }
          } catch (err) {
            console.error(`Failed to fetch movie ${review.movieId}`, err);
          }
        }
        setMovieData(movieMap);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, accessToken, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="font-serif text-4xl font-semibold text-ink-900 mb-2">
            My Reviews
          </h1>
          <p className="font-sans text-ink-600 mb-8">
            Movies and series you've reviewed
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-sans text-ink-500 text-sm">Loading your reviews...</p>
              </div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => {
                const movie = movieData[review.movieId];
                const posterUrl = movie ? getImageUrl(config, movie.poster_path) : null;

                return (
                  <div
                    key={review._id}
                    onClick={() => navigate(`/movie/${review.movieId}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-ink-100 hover:shadow-lg hover:border-ink-200 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden bg-ink-200">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={movie?.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-400 font-sans text-sm">
                          No image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-ink-950/80 text-white font-sans text-xs font-medium">
                        ★ {review.rating}/10
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-sans font-semibold text-ink-900 line-clamp-2 mb-2">
                        {movie?.title || 'Movie'}
                      </h3>
                      <p className="font-sans text-sm text-ink-600 line-clamp-2 mb-3">
                        {review.text}
                      </p>
                      <p className="font-sans text-xs text-ink-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-sans text-ink-500 text-lg mb-6">
                You haven't reviewed any movies yet
              </p>
              <button
                onClick={() => navigate('/')}
                className="font-sans font-semibold px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors"
              >
                Explore Movies
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
