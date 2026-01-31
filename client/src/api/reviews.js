const API_BASE = '/api/reviews';

export async function getMovieReviews(movieId, accessToken) {
  const res = await fetch(`${API_BASE}/${movieId}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function createReview(movieId, rating, text, accessToken) {
  const res = await fetch(`${API_BASE}/${movieId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ rating, text }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create review');
  }
  return res.json();
}

export async function deleteReview(reviewId, accessToken) {
  const res = await fetch(`${API_BASE}/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete review');
  }
  return res.json();
}
