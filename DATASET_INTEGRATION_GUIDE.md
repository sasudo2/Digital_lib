# Digital Library (Pathsala) - Dataset Integration & Features Guide

## 🎯 Overview
Comprehensive implementation of book dataset integration with advanced reading tracking, bookmarks, and discovery features.

## 📦 What's Been Implemented

### Backend Infrastructure

#### 1. **Database Schema Updates**
- ✅ `user_bookmarks` - Table for bookmarking books
- ✅ `user_reading_progress` - Table for tracking reading progress (page number, finished status, reading history)
- ✅ `archive_url` - New field in books table for Internet Archive links

#### 2. **Data Population**
- **Script Location**: `Backend/scripts/insertBooks.js`
- **Usage**: 
  ```bash
  cd Backend
  node scripts/insertBooks.js
  ```
- **What it does**:
  - Reads from `Dataset/books_dataset.json`
  - Auto-creates authors, genres, publishers
  - Sets null for missing data
  - Prevents duplicate entries
  - Logs progress and final count

#### 3. **New Models**
- **ReadingProgress Model** (`Backend/model/readingProgress.model.js`)
  - `updateProgress()` - Save current page and finished status
  - `getProgress()` - Get progress for a book
  - `getUserProgress()` - All reading data for user
  - `getFinishedBooks()` - Books user has finished
  - `getInProgressBooks()` - Books currently reading
  - `markAsFinished()` - Complete a book

- **Bookmark Model** (`Backend/model/bookmark.model.js`)
  - `addBookmark()` - Save book to bookmarks
  - `removeBookmark()` - Remove from bookmarks
  - `getUserBookmarks()` - Get all bookmarked books
  - `isBookmarked()` - Check bookmark status

#### 4. **Book Model Extensions**
- `searchSuggestions(searchTerm, limit)` - Autocomplete search with dynamic dropdown
- `getRandomPopularBooks(limit)` - Get 10 random highly-rated books

#### 5. **New Controllers**

**ReadingProgressController** (`Backend/controllers/readingProgress.controller.js`)
- `updateProgress` - Save reading progress (page number)
- `getProgress` - Get progress for a book
- `getUserProgress` - Get all reading history
- `getFinishedBooks` - List finished books
- `getInProgressBooks` - List in-progress books
- `markAsFinished` - Mark book as completed

**BookmarkController** (`Backend/controllers/bookmark.controller.js`)
- `addBookmark` - Save book to bookmarks
- `removeBookmark` - Remove from bookmarks
- `getBookmarks` - Get all bookmarks
- `isBookmarked` - Check if bookmarked
- `getBookmarkCount` - Get bookmark count

#### 6. **New Routes**

**Reading Progress Routes** (`Backend/routes/readingProgress.routes.js`)
```
PUT    /reading-progress/update           - Update reading progress
GET    /reading-progress/:bookId          - Get progress for a book
GET    /reading-progress/                 - Get all user progress
GET    /reading-progress/finished/all     - Get finished books
GET    /reading-progress/in-progress/all  - Get in-progress books
PUT    /reading-progress/:bookId/finish   - Mark as finished
```

**Bookmark Routes** (`Backend/routes/bookmark.routes.js`)
```
POST   /bookmarks/add                     - Add bookmark
POST   /bookmarks/remove                  - Remove bookmark
GET    /bookmarks/list                    - Get all bookmarks
GET    /bookmarks/check/:bookId           - Check if bookmarked
GET    /bookmarks/count/all               - Get bookmark count
```

**Book Search Route** (Added to book.routes.js)
```
GET    /books/search/suggestions          - Search suggestions (autocomplete)
```

### Frontend Components

#### 1. **SearchSuggestions Component**
**File**: `Frontend/src/components/SearchSuggestions.jsx`
- Dynamic autocomplete dropdown
- Shows title, author, genre, rating
- Click to open book in archive
- Debounced requests (300ms)
- Max 8 suggestions

#### 2. **ReadingProgressTracker Component**
**File**: `Frontend/src/components/ReadingProgressTracker.jsx`
- Track current page number
- Mark book as finished
- Show last read timestamp
- Visual confirmation (✅ when finished)
- Reset progress option
- Auto-saves to database

#### 3. **Updated BookDetail Page**
- Buttons for:
  - 📖 Open Book (opens archive_url)
  - ♥ Favorite toggle
  - 🔖 Bookmark toggle
- Integrated ReadingProgressTracker
- Display reviews from other readers
- Review submission form

### Data Flow

#### User Workflow:
1. **Search**: User types book title → Dynamic suggestions appear
2. **View**: Click suggestion → Opens book in Internet Archive + navigates to detail page
3. **Read**: Click "Open Book" button → Opens archive.org link in new tab
4. **Track**: 
   - Enter current page → Click "Save Page"
   - Or click "Mark as Finished" when done
5. **Organize**:
   - ♥ Mark as favorite
   - 🔖 Bookmark for later
6. **Profile**: All actions visible in user profile history

### API Endpoints Summary

#### Search & Discovery
- `GET /books/all` - All books
- `GET /books/:bookId` - Book details with archive_url
- `GET /books/search/suggestions?query=*&limit=10` - Autocomplete suggestions
- `GET /books/popular?limit=10` - Random popular books

#### Reading Progress
- `PUT /reading-progress/update` - Update progress
- `GET /reading-progress/:bookId` - Get progress
- `GET /reading-progress/` - User's reading history
- `GET /reading-progress/finished/all` - Finished books
- `GET /reading-progress/in-progress/all` - Currently reading
- `PUT /reading-progress/:bookId/finish` - Mark finished

#### Bookmarks
- `POST /bookmarks/add` - Add bookmark
- `POST /bookmarks/remove` - Remove bookmark
- `GET /bookmarks/list` - All bookmarks
- `GET /bookmarks/check/:bookId` - Is bookmarked
- `GET /bookmarks/count/all` - Bookmark count

#### Favorites (Already Implemented)
- `POST /favorites/add` - Add favorite
- `POST /favorites/remove` - Remove favorite
- `GET /favorites/list` - All favorites
- `GET /favorites/check/:bookId` - Is favorite

## 🚀 Getting Started

### 1. Update Database
```bash
# Ensure database connection is working
npm start  # Backend will auto-create tables
```

### 2. Insert Book Data
```bash
cd Backend
node scripts/insertBooks.js
```

### 3. Verify Installation
- Check terminal output for success messages
- Each book should show: title, author, genre, archive_url
- Test endpoints using Postman or your frontend

## 📱 Frontend Features

### Home Page
- Popular Books section (random 10 books)
- Search bar with dynamic suggestions
- "See All Popular Books" link

### Browse Page
- Search suggestions dropdown
- Genre filter dropdown
- Sort options (Rating, Title)
- Favorite toggle on cards

### Book Detail Page
- 📖 Open Book (archive)
- ♥ Favorite toggle
- 🔖 Bookmark toggle
- Reading progress tracker
- Review form
- Reader reviews display

### Profile/My Library
- Finished books list
- In-progress books (with current page)
- Bookmarks collection
- Favorites collection
- Reading statistics

## 📊 Database Tables

```sql
user_bookmarks
├── id (SERIAL PRIMARY KEY)
├── user_id (FK users)
├── book_id (FK books)
├── created_at

user_reading_progress
├── id (SERIAL PRIMARY KEY)
├── user_id (FK users)
├── book_id (FK books)
├── current_page (INTEGER)
├── is_finished (BOOLEAN)
├── started_at (TIMESTAMP)
├── finished_at (TIMESTAMP)
├── last_read_at (TIMESTAMP)

books (updated)
├── archive_url (TEXT)      <- New field
```

## 🔧 Configuration

### Environment Variables (Backend/.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pathsala
DB_USER=postgres
DB_PASSWORD=your_password
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_BASE_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Issue: Books not inserting
- Check database connection
- Verify JSON file path is correct
- Check console for specific errors
- Ensure authors, genres, publishers tables exist

### Issue: Search not working
- Verify books are in database
- Check authorization header in requests
- Verify API endpoint is registered in app.js

### Issue: Archive links not opening
- Ensure archive_url is populated in database
- Check if URL is valid (try in browser)
- Some old books may not have archive versions

## 📝 Notes

- All user actions (reading, bookmarking, favoriting) are tied to user_id
- Archive links point to Internet Archive (https://archive.org/)
- Reading progress auto-saves to database
- Historical data maintains user engagement metrics
- Finished books show completion timestamp

## ✅ Testing Checklist

- [ ] Run insertBooks.js successfully
- [ ] Search returns suggestions
- [ ] Archive link opens in new tab
- [ ] Page number saves correctly
- [ ] Bookmark toggle works
- [ ] Finished status persists
- [ ] Profile shows reading history
- [ ] Popular books load randomly

---

**Ready to use!** The system now has real book data with full tracking capabilities.
