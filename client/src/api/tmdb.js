const API_BASE = '/api/tmdb';

async function fetchTMDB(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/${endpoint}${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function getConfiguration() {
  return fetchTMDB('configuration');
}

export async function getTrendingMovies() {
  return fetchTMDB('trending/movie/day');
}

export async function getPopularMovies(page = 1) {
  return fetchTMDB('movie/popular', { page });
}

export async function getNowPlaying(page = 1) {
  return fetchTMDB('movie/now_playing', { page });
}

export async function getTopRated(page = 1) {
  return fetchTMDB('movie/top_rated', { page });
}

export async function searchMovies(query, page = 1) {
  return fetchTMDB('search/movie', { query, page });
}

export async function getMovieDetails(movieId) {
  return fetchTMDB(`movie/${movieId}`);
}

export async function getMovieCredits(movieId) {
  return fetchTMDB(`movie/${movieId}/credits`);
}
