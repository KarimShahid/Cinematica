import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from backend/.env FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

console.log('Env check:');
console.log(`  PORT: ${process.env.PORT}`);
console.log(`  TMDB_API_KEY: ${process.env.TMDB_API_KEY ? '✓ loaded' : '✗ missing'}`);
console.log(`  TMDB_BASE_URL: ${process.env.TMDB_BASE_URL}`);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinematica';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dynamic imports AFTER dotenv.config()
(async () => {
  const movieRoutes = (await import('./routes/movies.js')).default;
  const reviewRoutes = (await import('./routes/reviews.js')).default;
  const userRoutes = (await import('./routes/users.js')).default;

  // Routes
  app.use('/api/movies', movieRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/users', userRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
