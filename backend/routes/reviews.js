import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews', message: error.message });
  }
});

// Create a review
router.post('/', async (req, res) => {
  try {
    const { userId, movieId, rating, title, body } = req.body;
    
    if (!userId || !movieId || !rating || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const review = new Review({ userId, movieId, rating, title, body });
    await review.save();
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review', message: error.message });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review', message: error.message });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review', message: error.message });
  }
});

export default router;
