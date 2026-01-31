import React, { useState, useEffect } from 'react'
import { fetchNowPlaying } from '../services/movieService'

function Hero() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchNowPlaying()
        setMovies(data.slice(0, 8))
      } catch (error) {
        console.error('Failed to load movies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  return (
    <section className="hero container">
      <div className="hero-left">
        <h2>Discover. Rate. Discuss.</h2>
        <p className="lead">A modern place to review and explore films and series — curated collections, trending now, and community reviews coming soon.</p>
      </div>
      <div className="hero-right">
        <div className="banner-scroll" aria-label="Now playing carousel">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="banner-item"
              onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                alt={movie.title}
              />
              <div className="meta">
                <strong>{movie.title}</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {movie.release_date || ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
