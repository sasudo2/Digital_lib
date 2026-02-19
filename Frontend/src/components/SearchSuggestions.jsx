import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchSuggestions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/books/search/suggestions`,
        {
          params: { query: searchTerm, limit: 8 },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (book) => {
    // Navigate to book detail page
    navigate(`/book/${book.book_id}`, { state: { book } });
    
    // Clear search state
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim().length > 0 && setShowSuggestions(true)}
          className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none text-lg"
        />
        <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition shadow-lg">
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map((book) => (
            <button
              key={book.book_id}
              onClick={() => handleSuggestionClick(book)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author_name || 'Unknown Author'}</p>
                  <p className="text-xs text-gray-500">{book.genre_name || 'Genre'}</p>
                </div>
                {book.average_rating && (
                  <div className="text-right">
                    <p className="text-sm text-yellow-500 font-semibold">
                      ★ {parseFloat(book.average_rating).toFixed(1)}
                    </p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && searchTerm.trim().length > 0 && suggestions.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-gray-600">
          No books found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}
