import express from 'express';
import axios from 'axios';
import Movie from '../models/Movie.js';

const router = express.Router();

const TMDB_BASE = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;
const IMG_BASE = process.env.IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

console.log(`TMDB Route Debug: key="${TMDB_KEY}", base="${TMDB_BASE}"`);

// Fetch now playing movies from TMDB
router.get('/now-playing', async (req, res) => {
  try {
    console.log(`[TMDB Request] /movie/now_playing with key: ${TMDB_KEY ? TMDB_KEY.slice(0, 8) + '...' : 'UNDEFINED'}`);
    const response = await axios.get(`${TMDB_BASE}/movie/now_playing`, {
      params: {
        api_key: TMDB_KEY,
        language: 'en-US',
        page: req.query.page || 1
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(`[TMDB Error] Status: ${error.response?.status}, Message: ${error.response?.data?.status_message || error.message}`);
    res.status(500).json({ error: 'Failed to fetch now playing movies', message: error.message });
  }
});

// Fetch popular movies from TMDB
router.get('/popular', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/movie/popular`, {
      params: {
        api_key: TMDB_KEY,
        language: 'en-US',
        page: req.query.page || 1
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular movies', message: error.message });
  }
});

// Fetch popular TV shows from TMDB
router.get('/tv/popular', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/tv/popular`, {
      params: {
        api_key: TMDB_KEY,
        language: 'en-US',
        page: req.query.page || 1
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular TV shows', message: error.message });
  }
});

// Get movie details by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/movie/${req.params.id}`, {
      params: {
        api_key: TMDB_KEY,
        language: 'en-US'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details', message: error.message });
  }
});

export default router;
