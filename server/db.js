import { User, Review } from './models.js';
import bcrypt from 'bcryptjs';

export async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id) {
  return User.findById(id);
}

export async function createUser(email, password, name) {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name.trim(),
  });

  await newUser.save();

  return {
    id: newUser._id,
    email: newUser.email,
    name: newUser.name,
  };
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Reviews
export async function createReview(movieId, userId, userName, rating, text) {
  const review = new Review({
    movieId,
    userId,
    userName,
    rating,
    text,
  });

  await review.save();
  return review;
}

export async function getMovieReviews(movieId) {
  return Review.find({ movieId })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');
}

export async function deleteReview(reviewId, userId) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  if (review.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  await Review.findByIdAndDelete(reviewId);
  return review;
}
