import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReviewForm({ bookId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExistingReview();
  }, [bookId]);

  const fetchExistingReview = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        setExistingReview(null);
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/reviews/book/${bookId}/my-review`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.review) {
        setExistingReview(response.data.review);
        setRating(response.data.review.rating);
        setComment(response.data.review.comment);
      }
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (!token) {
      setError('Login to submit a review');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (existingReview) {
        // Update existing review
        response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/reviews/${existingReview.review_id}`,
          { rating, comment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Review updated successfully');
      } else {
        // Create new review
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/reviews/create`,
          { bookId, rating, comment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Review added successfully');
        setExistingReview(response.data.review);
      }

      setIsEditing(false);
      onReviewSubmitted && onReviewSubmitted();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        setError('Login to delete a review');
        setLoading(false);
        return;
      }
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/reviews/${existingReview.review_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Review deleted successfully');
      setExistingReview(null);
      setRating(0);
      setComment('');
      onReviewSubmitted && onReviewSubmitted();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {existingReview && !isEditing ? 'Your Review' : 'Add Your Review'}
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      {existingReview && !isEditing ? (
        <div className="border border-gray-200 rounded p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < existingReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(existingReview.created_at).toLocaleDateString()}
            </span>
          </div>
          {existingReview.comment && (
            <p className="text-gray-700 mb-4">{existingReview.comment}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Rating selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-4xl transition-colors"
                >
                  <span
                    className={`${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && <p className="text-sm text-gray-600 mt-1">{rating}/5</p>}
          </div>

          {/* Comment textarea */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Add Review'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setRating(existingReview.rating);
                  setComment(existingReview.comment);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
