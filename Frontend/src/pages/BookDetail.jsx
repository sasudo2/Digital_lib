import React, { useState, useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import ReviewForm from "../components/ReviewForm";
import mainLogo from "../assets/main_logo.png";

function BookDetail() {
  const { bookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  
  const [book, setBook] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!book);
  const [alert, setAlert] = useState("");
  const [pdfStartTime, setPdfStartTime] = useState(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!book) {
      fetchBook();
    } else {
      checkFavoriteStatus();
      fetchReviews();
    }
  }, [bookId, book]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/books/${bookId}`
      );
      if (response.data.success) {
        setBook(response.data.book);
        checkFavoriteStatus();
        fetchReviews();
      }
    } catch (error) {
      setAlert("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/favorites/check/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setIsFavorite(response.data.isFavorite || false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/reviews/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/favorites/remove`,
          { bookId: book.book_id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/favorites/add`,
          { bookId: book.book_id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setAlert('Failed to update favorite status');
    }
  };

  const handlePdfClick = () => {
    if (!book.book_url) {
      setAlert("Book URL not available");
      return;
    }
    setPdfStartTime(Date.now());
    setIsReadingPdf(true);
    // Open the book URL (PDF or external link)
    window.open(book.book_url, "_blank");
  };

  const handleReturnFromPdf = async () => {
    if (!pdfStartTime) return;

    try {
      const timeSpentMinutes = Math.round((Date.now() - pdfStartTime) / 60000);
      
      if (timeSpentMinutes > 0) {
        // Record reading time
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/reading/update-time`,
          {
            bookId: book.book_id,
            timeSpentMinutes,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          // Update user context
          setUser(response.data.user);
          localStorage.setItem("pathsala_user", JSON.stringify(response.data.user));
          
          setAlert(`📚 Great! You read for ${timeSpentMinutes} minutes. Keep it up!`);
          setPdfStartTime(null);
          setIsReadingPdf(false);
        }
      }
    } catch (error) {
      console.error("Error recording reading time:", error);
      setAlert("Error recording reading time");
    }
  };

  // Listen for when user returns from PDF
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isReadingPdf) {
        handleReturnFromPdf();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isReadingPdf, pdfStartTime]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <img src={mainLogo} alt="Pathsala Logo" className="h-12 w-12 object-contain" />
              <h1 className="text-3xl font-bold text-white">Pathsala</h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-2xl text-gray-600 mb-6">Book not found</p>
            <button
              onClick={() => navigate("/browse")}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <img src={mainLogo} alt="Pathsala Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-3xl font-bold text-white">Pathsala</h1>
          </div>
          <button
            onClick={() => navigate("/browse")}
            className="text-white hover:text-yellow-300 font-medium transition"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Alert */}
        {alert && (
          <div className="bg-green-500 text-white p-4 rounded mb-6 text-center">
            {alert}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="h-96 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-lg shadow-lg flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-white text-2xl font-bold line-clamp-4">{book.title}</p>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{book.title}</h1>
            
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Author</p>
                <p className="text-xl font-semibold text-gray-800">{book.author_name || "Unknown"}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Genre</p>
                <p className="text-lg text-gray-800">{book.genre_name || "Fiction"}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Publisher</p>
                <p className="text-lg text-gray-800">
                  {book.publisher_name || "Unknown"} 
                  {book.country && ` (${book.country})`}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Publication Year</p>
                <p className="text-lg text-gray-800">{book.publication_year || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">ISBN</p>
                <p className="text-lg text-gray-800">{book.isbn || "N/A"}</p>
              </div>
            </div>

            {/* CTA Button and Favorite */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handlePdfClick}
                disabled={!book.book_url}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-pink-600 hover:to-orange-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📖 Open & Read
              </button>
              <button
                onClick={toggleFavorite}
                className={`px-6 py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                ♥
              </button>
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              💡 Time spent reading will be automatically tracked when you return
            </p>
          </div>
        </div>

        {/* Review Form Section */}
        <ReviewForm 
          bookId={bookId} 
          onReviewSubmitted={() => fetchReviews()}
        />

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Book</h2>
          <p className="text-gray-700 leading-relaxed">
            This is one of our featured books in the Pathsala Digital Library. 
            Click the button above to start reading. Your reading time will be 
            automatically recorded and added to your profile when you return.
          </p>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reader Reviews</h2>
          {loadingReviews ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.review_id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="font-bold text-gray-700">{review.first_name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{review.first_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mt-3">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default BookDetail;
