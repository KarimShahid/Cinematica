export default function StatsBar() {
  const stats = [
    { value: '500K+', label: 'Movies & Series' },
    { value: '2.4M+', label: 'Community Reviews' },
    { value: '1.8M+', label: 'Film Lovers' },
  ];

  return (
    <section className="border-y border-ink-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap justify-center sm:justify-around gap-8 sm:gap-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center sm:text-left">
              <p className="font-serif text-2xl sm:text-3xl font-semibold text-ink-950">
                {value}
              </p>
              <p className="font-sans text-sm text-ink-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
