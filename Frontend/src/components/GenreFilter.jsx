import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GenreFilter({ onGenreChange, selectedGenre }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/genres`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setGenres(response.data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Filter by Genre
      </label>
      <select
        value={selectedGenre || ''}
        onChange={(e) => onGenreChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.genre_id} value={genre.genre_id}>
            {genre.genre_name}
          </option>
        ))}
      </select>
    </div>
  );
}
