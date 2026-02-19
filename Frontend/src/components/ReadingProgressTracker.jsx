import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReadingProgressTracker({ bookId, onUpdate }) {
  const [progress, setProgress] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProgress();
  }, [bookId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reading-progress/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      const prog = response.data.progress;
      setProgress(prog);
      setCurrentPage(prog.current_page || 0);
      setIsFinished(prog.is_finished || false);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/reading-progress/update`,
        { bookId, currentPage, isFinished },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setMessage('📍 Progress saved!');
      setTimeout(() => setMessage(''), 3000);
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
      setMessage('Error saving progress');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsFinished = async () => {
    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/reading-progress/${bookId}/finish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setIsFinished(true);
      setMessage('✅ Marked as finished!');
      setTimeout(() => setMessage(''), 3000);
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Error marking as finished:', error);
      setMessage('Error marking as finished');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading progress...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📖 Reading Progress</h3>

      {message && (
        <div className={`mb-4 p-3 rounded text-white text-center ${
          message.startsWith('✅') || message.startsWith('📍')
            ? 'bg-green-500'
            : 'bg-red-500'
        }`}>
          {message}
        </div>
      )}

      {!isFinished ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Page
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="Enter page number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <button
                onClick={handleUpdateProgress}
                disabled={saving}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Page'}
              </button>
            </div>
            {progress?.current_page > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Last read at: {new Date(progress.last_read_at).toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={handleMarkAsFinished}
            disabled={saving}
            className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            ✓ Mark as Finished Reading
          </button>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-5xl mb-2">✅</div>
          <p className="text-lg font-semibold text-green-600 mb-2">Book Finished!</p>
          <p className="text-gray-600 mb-4">
            Completed on {new Date(progress?.finished_at).toLocaleDateString()}
          </p>
          <button
            onClick={() => {
              setIsFinished(false);
              setCurrentPage(0);
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
}
