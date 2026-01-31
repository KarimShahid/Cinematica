import React, { useState, useEffect } from 'react'
import { fetchPopularMovies, fetchPopularTV } from '../services/movieService'

function MovieGrid() {
  const [movies, setMovies] = useState([])
  const [tvShows, setTvShows] = useState([])

  useEffect(() => {
    const loadContent = async () => {
      try {
        const moviesData = await fetchPopularMovies()
        const tvData = await fetchPopularTV()
        setMovies(moviesData.slice(0, 20))
        setTvShows(tvData.slice(0, 20))
      } catch (error) {
        console.error('Failed to load content:', error)
      }
    }

    loadContent()
  }, [])

  const MoviePoster = ({ item, isTV = false }) => (
    <div
      className="poster"
      onClick={() => {
        const url = `https://www.themoviedb.org/${isTV ? 'tv' : 'movie'}/${item.id}`
        window.open(url, '_blank')
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`}
        alt={item.title || item.name}
      />
      <div className="title">{item.title || item.name}</div>
    </div>
  )

  return (
    <>
      <section className="container section">
        <h3>Popular Movies</h3>
        <div id="popular-movies" className="poster-grid">
          {movies.map((movie) => (
            <MoviePoster key={movie.id} item={movie} />
          ))}
        </div>
      </section>

      <section className="container section">
        <h3>Popular TV</h3>
        <div id="popular-tv" className="poster-grid">
          {tvShows.map((tv) => (
            <MoviePoster key={tv.id} item={tv} isTV={true} />
          ))}
        </div>
      </section>
    </>
  )
}

export default MovieGrid
