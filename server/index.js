import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, verifyPassword, findUserById, createReview, getMovieReviews, deleteReview } from './db.js';
import { generateTokens, verifyRefreshToken, authMiddleware } from './auth.js';
import { connectDB } from './mongodb.js';

dotenv.config();

const app = express();
const PORT = 5001;
const TMDB_BASE = 'https://api.themoviedb.org/3';

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await createUser(email, password, name);
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Review Routes
app.get('/api/reviews/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await getMovieReviews(parseInt(movieId));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews/:movieId', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, text } = req.body;
    const user = await findUserById(req.userId);

    if (!rating || !text) {
      return res.status(400).json({ error: 'Rating and text required' });
    }

    const review = await createReview(
      parseInt(movieId),
      req.userId,
      user.name,
      rating,
      text
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

app.delete('/api/reviews/:reviewId', authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    await deleteReview(reviewId, req.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
  }
});

// Proxy TMDB API requests (keeps API key server-side)
app.get(/^\/api\/tmdb\/(.+)/, async (req, res) => {
  try {
    const path = req.path.replace(/^\/api\/tmdb\//, '');
    const query = new URLSearchParams(req.query).toString();
    const url = `${TMDB_BASE}/${path}?api_key=${process.env.TMDB_API_KEY}${query ? `&${query}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('TMDB proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from TMDB' });
  }
});

// Start server with MongoDB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Cinematica server running at http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
