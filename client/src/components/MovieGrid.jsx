function getImageUrl(config, path) {
  if (!path || !config?.secure_base_url) return null;
  const sizes = config.poster_sizes || [];
  const size = sizes.includes('w500') ? 'w500' : sizes[sizes.length - 1] || 'original';
  return `${config.secure_base_url}${size}${path}`;
}

function MovieCard({ movie, config }) {
  const posterUrl = getImageUrl(config, movie.poster_path);
  const rating = movie.vote_average?.toFixed(1);

  return (
    <a
      href={`/movie/${movie.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-ink-100 hover:shadow-lg hover:border-ink-200 transition-all duration-300"
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-ink-200">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-400 font-sans text-sm">
            No image
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-ink-950/80 text-white font-sans text-xs font-medium">
          ★ {rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-sans font-semibold text-ink-900 group-hover:text-gold-600 transition-colors line-clamp-2">
          {movie.title}
        </h3>
        <p className="font-sans text-sm text-ink-500 mt-1">
          {movie.release_date?.slice(0, 4)}
        </p>
      </div>
    </a>
  );
}

export default function MovieGrid({ movies, config }) {
  if (!movies?.length) {
    return (
      <p className="font-sans text-ink-500 text-center py-12">
        No movies to display. Check your connection and try again.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} config={config} />
      ))}
    </div>
  );
}
