import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  releaseDate: Date,
  backdropPath: String,
  posterPath: String,
  overview: String,
  rating: Number,
  voteCount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Movie', movieSchema);
