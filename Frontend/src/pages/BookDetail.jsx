import React, { useState, useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import ReviewForm from "../components/ReviewForm";
import ReadingProgressTracker from "../components/ReadingProgressTracker";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Avatar from "react-avatar";

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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const formatTime = (minutes = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUser({ ...user, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!book) {
      fetchBook();
    } else {
      checkFavoriteStatus();
      checkBookmarkStatus();
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
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        setIsFavorite(false);
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/favorites/check/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        `${import.meta.env.VITE_BASE_URL}/reviews/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken') || localStorage.getItem('token')}`,
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
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        setAlert('Login to manage favorites');
        return;
      }
      if (isFavorite) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/favorites/remove`,
          { bookId: book.book_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/favorites/add`,
          { bookId: book.book_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  const checkBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        setIsBookmarked(false);
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/bookmarks/check/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsBookmarked(response.data.isBookmarked || false);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        setAlert('Login to manage bookmarks');
        return;
      }
      if (isBookmarked) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/bookmarks/remove`,
          { bookId: book.book_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/bookmarks/add`,
          { bookId: book.book_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setAlert('Failed to update bookmark status');
    }
  };

  const handlePdfClick = () => {
    // Open the archive URL first, fallback to book URL if not available
    const urlToOpen = book.archive_url?.trim() || book.book_url?.trim();
    
    if (!urlToOpen) {
      setAlert("Archive URL and Book URL are not available for this book");
      return;
    }
    
    setPdfStartTime(Date.now());
    setIsReadingPdf(true);
    window.open(urlToOpen, "_blank");
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
          
          setAlert(`Great! You read for ${timeSpentMinutes} minutes. Keep it up!`);
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
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-2xl text-gray-600 mb-6">Book not found</p>
            <button
              onClick={() => navigate("/browse")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader showProfileButton onProfileClick={() => setShowProfile(true)} />

      <main className="container mx-auto px-4 py-12">
        {/* Alert */}
        {alert && (
          <div className="bg-black text-white p-4 rounded mb-6 text-center">
            {alert}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="h-96 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600 rounded-lg shadow-lg flex items-center justify-center p-4">
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
                disabled={!book.archive_url && !book.book_url}
                className="flex-1 bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📖 Open Book
              </button>
              <button
                onClick={toggleFavorite}
                className={`px-6 py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                  isFavorite
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                ♥
              </button>
              <button
                onClick={toggleBookmark}
                className={`px-6 py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                  isBookmarked
                    ? 'bg-gray-800 text-white hover:bg-black'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                🔖
              </button>
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              Open the archive link to read the book
            </p>
          </div>
        </div>

        {/* Reading Progress Tracker */}
        <ReadingProgressTracker 
          bookId={bookId}
          onUpdate={() => setRefreshProgress(!refreshProgress)}
        />

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
              {reviews.map((review) => {
                const firstName = review.firstname || review.first_name || "";
                const lastName = review.lastname || review.last_name || "";
                const displayName = `${firstName} ${lastName}`.trim() || "Reader";
                const initial = displayName.charAt(0);

                return (
                  <div key={review.review_id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="font-bold text-gray-700">{initial}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{displayName}</p>
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
                              i < review.rating ? 'text-gray-900' : 'text-gray-300'
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
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
          )}
        </div>
      </main>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowProfile(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6 z-10">
            <h3 className="text-xl font-bold mb-4">Your Profile</h3>
            <div className="flex gap-4 items-center mb-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {user && user.profilePic ? (
                  <img src={user.profilePic} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <Avatar
                    name={
                      user && user.fullname && (user.fullname.firstname || user.fullname.lastname)
                        ? `${user.fullname.firstname || ''} ${user.fullname.lastname || ''}`.trim()
                        : "User"
                    }
                    size="80"
                    round
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user?.fullname?.firstname} {user?.fullname?.lastname}</p>
                <p className="text-sm text-gray-600">{user?.email || "No email set"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Read Books</div>
                <div className="font-semibold">{(user?.readBooks && user.readBooks.length) || 0}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Time Spent</div>
                <div className="font-semibold">{formatTime(user?.timeSpentMinutes)}</div>
              </div>
              <div className="col-span-2 p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Account Created</div>
                <div className="font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Profile Photo</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
            </div>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("pathsala_user");
                  navigate("/");
                }}
                className="px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800 transition"
              >
                Logout
              </button>
              <button onClick={() => setShowProfile(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">Close</button>
            </div>
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

export default BookDetail;
