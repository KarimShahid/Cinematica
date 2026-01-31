import axios from 'axios'

const API_BASE = '/api/movies'

export const fetchNowPlaying = async () => {
  try {
    const response = await axios.get(`${API_BASE}/now-playing`)
    return response.data.results || []
  } catch (error) {
    console.error('Error fetching now playing movies:', error)
    return []
  }
}

export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE}/popular`)
    return response.data.results || []
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return []
  }
}

export const fetchPopularTV = async () => {
  try {
    const response = await axios.get(`${API_BASE}/tv/popular`)
    return response.data.results || []
  } catch (error) {
    console.error('Error fetching popular TV shows:', error)
    return []
  }
}

export const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
}
