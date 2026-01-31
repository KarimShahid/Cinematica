import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getConfiguration } from '../api/tmdb';
import Header from '../components/Header';
import Footer from '../components/Footer';

function getImageUrl(config, path) {
  if (!path || !config?.secure_base_url) return null;
  const sizes = config.poster_sizes || [];
  const size = sizes.includes('w500') ? 'w500' : sizes[sizes.length - 1] || 'original';
  return `${config.secure_base_url}${size}${path}`;
}

function getBackdropUrl(config, path) {
  if (!path || !config?.secure_base_url) return null;
  const sizes = config.backdrop_sizes || [];
  const size = sizes.includes('w1280') ? 'w1280' : sizes[sizes.length - 1] || 'original';
  return `${config.secure_base_url}${size}${path}`;
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [configRes, movieRes, creditsRes] = await Promise.all([
          getConfiguration(),
          getMovieDetails(id),
          getMovieCredits(id),
        ]);
        setConfig(configRes?.images || {});
        setMovie(movieRes);
        setCredits(creditsRes);
        // Load reviews from localStorage
        const savedReviews = JSON.parse(localStorage.getItem(`movie-${id}-reviews`) || '[]');
        setReviews(savedReviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewerName.trim()) return;

    setSubmitting(true);
    const newReview = {
      id: Date.now(),
      name: reviewerName,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`movie-${id}-reviews`, JSON.stringify(updatedReviews));
    
    setReviewText('');
    setReviewerName('');
    setReviewRating(5);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-ink-500 text-sm">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-sans text-ink-500">Movie not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(config, movie.backdrop_path);
  const posterUrl = getImageUrl(config, movie.poster_path);
  const director = credits?.crew?.find((c) => c.job === 'Director');
  const cast = credits?.cast?.slice(0, 6) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative">
          {backdropUrl && (
            <div className="absolute inset-0 h-96 overflow-hidden">
              <img
                src={backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
            </div>
          )}
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <button
              onClick={() => navigate(-1)}
              className="mb-8 font-sans text-gold-600 hover:text-gold-700 transition-colors"
            >
              ← Back
            </button>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Poster */}
              <div>
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-ink-200 rounded-xl flex items-center justify-center">
                    <span className="text-ink-400">No image</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="md:col-span-2">
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900 mb-2">
                  {movie.title}
                </h1>
                {movie.release_date && (
                  <p className="font-sans text-ink-500 mb-4">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">★</span>
                    <span className="font-serif text-2xl font-bold text-ink-900">
                      {movie.vote_average?.toFixed(1)}/10
                    </span>
                  </div>
                  <span className="font-sans text-ink-500">
                    ({movie.vote_count?.toLocaleString()} votes)
                  </span>
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="inline-block px-3 py-1 bg-gold-100 text-gold-900 rounded-full font-sans text-sm font-medium"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {director && (
                  <p className="font-sans text-ink-600 mb-4">
                    <span className="font-semibold">Director:</span> {director.name}
                  </p>
                )}

                {movie.runtime && (
                  <p className="font-sans text-ink-600 mb-6">
                    <span className="font-semibold">Runtime:</span> {movie.runtime} minutes
                  </p>
                )}

                {movie.overview && (
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-2">
                      Overview
                    </h2>
                    <p className="font-sans text-ink-700 leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <h2 className="font-serif text-3xl font-semibold text-ink-900 mb-8">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  {actor.profile_path && (
                    <img
                      src={getImageUrl(config, actor.profile_path)}
                      alt={actor.name}
                      className="w-full aspect-square rounded-lg object-cover mb-2"
                    />
                  )}
                  <p className="font-sans font-medium text-ink-900 text-sm">{actor.name}</p>
                  <p className="font-sans text-ink-500 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-serif text-3xl font-semibold text-ink-900 mb-8">
            Community Reviews
          </h2>

          {/* Review Form */}
          <form
            onSubmit={handleSubmitReview}
            className="bg-ink-50 rounded-xl p-6 mb-8 border border-ink-200"
          >
            <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
              Share Your Review
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="font-sans px-4 py-2 rounded-lg border border-ink-300 focus:outline-none focus:border-gold-500"
                required
              />
              <div>
                <label className="font-sans text-sm font-medium text-ink-700 block mb-2">
                  Rating: {reviewRating}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <textarea
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="w-full font-sans px-4 py-2 rounded-lg border border-ink-300 focus:outline-none focus:border-gold-500 mb-4"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-600 hover:bg-gold-700 disabled:bg-ink-300 text-white font-sans font-semibold py-2 rounded-lg transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-6 border border-ink-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-sans font-semibold text-ink-900">{review.name}</p>
                    <span className="text-sm font-sans text-ink-500">{review.date}</span>
                  </div>
                  <div className="mb-3">
                    <span className="font-sans font-medium text-gold-600">
                      {'★'.repeat(review.rating)}
                    </span>
                    <span className="font-sans text-ink-400 ml-2">{review.rating}/10</span>
                  </div>
                  <p className="font-sans text-ink-700 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans text-ink-500 text-center py-8">
              No reviews yet. Be the first to share your thoughts!
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
