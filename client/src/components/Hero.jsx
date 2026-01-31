function getImageUrl(config, path, type = 'poster') {
  if (!path || !config?.secure_base_url) return null;
  const sizes = type === 'backdrop' ? (config.backdrop_sizes || config.poster_sizes || []) : (config.poster_sizes || []);
  const size = sizes.includes('w1280') ? 'w1280' : sizes.includes('w780') ? 'w780' : sizes[sizes.length - 1] || 'original';
  return `${config.secure_base_url}${size}${path}`;
}

export default function Hero({ config, featured }) {
  const backdropUrl = featured
    ? getImageUrl(config, featured.backdrop_path || featured.poster_path, 'backdrop')
    : null;

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex items-end overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        {backdropUrl ? (
          <>
            <img
              src={backdropUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-700 to-ink-900" />
        )}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-2xl animate-[slideUp_0.8s_ease-out_forwards] opacity-0" style={{ animationDelay: '0.2s' }}>
          <p className="font-sans text-gold-400 text-sm font-medium uppercase tracking-widest mb-2">
            Featured Today
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-4">
            {featured?.title || 'Discover & Review'}
          </h1>
          <p className="font-sans text-ink-200 text-lg sm:text-xl max-w-xl line-clamp-2">
            {featured?.overview || 'Find your next favorite film. Share your thoughts with the community.'}
          </p>
          <div className="flex items-center gap-6 mt-8">
            <button className="font-sans font-semibold px-6 py-3 bg-gold-500 text-ink-950 rounded-lg hover:bg-gold-400 transition-colors">
              Read Reviews
            </button>
            <button className="font-sans font-medium px-6 py-3 border border-ink-300 text-white rounded-lg hover:border-white hover:bg-white/10 transition-colors">
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
