# Pathshala - Digital Library System

This repository contains a robust authentication and authorization system for an online library application, supporting both **Users** (readers) and **Captains** (librarians). The project is split into two main directories:

- [Frontend/](Frontend/) — React + Vite UI for registration, login, and protected routes.
- [Backend/](Backend/) — Node.js + Express REST API with JWT, bcrypt, and security best practices.

---

## Features

- **User & Captain Registration**: Secure signup forms with validation.
- **Login & Logout**: JWT-based authentication, token blacklisting for logout.
- **Protected Routes**: Only authenticated users/captains can access certain pages.
- **Password Security**: Passwords are hashed using bcrypt.
- **Token Security**: JWT tokens are used for stateless authentication.
- **Validation**: Input validation using express-validator.
- **Good Looking UI**: Responsive, modern design using Tailwind CSS.

---

## Technologies Used

- **Frontend**: React, React Router, Axios, Tailwind CSS, Vite
- **Backend**: Node.js, Express, PostgreSQL (node-postgres), JWT, bcrypt, express-validator, cookie-parser, CORS
- **Database**: PostgreSQL

---

## Project Structure

```
Pathshala/
├── Backend/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── index.css
│   └── package.json
└── readme.md
```

---

## Backend Overview

- **User Endpoints**: `/users/register`, `/users/login`, `/users/profile`, `/users/logout`
- **Captain Endpoints**: `/captains/register`, `/captains/login`, `/captains/profile`, `/captains/logout`
- **Security**: Passwords are hashed before storing. JWT tokens are issued on login and checked for protected routes. Blacklisted tokens prevent reuse after logout.
- **Validation**: All input is validated for length, format, and required fields.

See [Backend/readme.md](Backend/readme.md) for detailed API documentation.

---

## Frontend Overview

- **Pages**: Registration, Login, Home, Logout for both Users and Captains.
- **Context Providers**: Global state for user and captain authentication.
- **Protected Routes**: Only accessible with a valid JWT token.
- **UI**: Clean, responsive forms and navigation using Tailwind CSS.

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/deepshresthaa/Pathshala.git
cd Pathshala
```

### 2. Install PostgreSQL

**On Ubuntu/Debian:**
```sh
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**On macOS (using Homebrew):**
```sh
brew install postgresql
brew services start postgresql
```

**On Windows:**
- Download from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)
- Run the installer and follow the setup wizard
- Remember the password you set for the `postgres` user

### 3. Create Database and User

1. Access PostgreSQL prompt:
   ```sh
   sudo -u postgres psql
   ```
   
   On Windows, use: `psql -U postgres`

2. Create a new database:
   ```sql
   CREATE DATABASE digital_library_db;
   ```

3. Create a new user with password:
   ```sql
   CREATE USER library_user WITH PASSWORD 'your_secure_password';
   ```

4. Grant all privileges to the user:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE digital_library_db TO library_user;
   ```

5. Exit PostgreSQL prompt:
   ```sql
   \q
   ```

### 4. Setup Backend

- Install dependencies:
  ```sh
  cd Backend
  npm install
  ```
- Create a `.env` file in the `Backend` directory with:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=digital_library_db
  DB_USER=library_user
  DB_PASSWORD=your_secure_password
  JWT_SECRET=your_jwt_secret_key
  ```
  
  **Replace `your_secure_password` with the password you created in step 3.**

- Start the server:
  ```sh
  node server.js
  ```
  
  The server will automatically create all required database tables on first run.

### 5. Insert Books into Database

To populate your database with books from the dataset:

```sh
cd Backend/scripts
node insertBooks.js
```

This will read the `Dataset/books_dataset.json` file and insert all books into your PostgreSQL database.

### 6. Setup Frontend

- Install dependencies:
  ```sh
  cd ../Frontend
  npm install
  ```
- Create a `.env` file with:
  ```
  VITE_BASE_URL=http://localhost:5000
  ```
- Start the development server:
  ```sh
  npm run dev
  ```

---

## Security Highlights

- **JWT**: Used for stateless authentication, signed with a secret.
- **bcrypt**: Passwords are securely hashed before storing.
- **Token Blacklisting**: Prevents reuse of JWTs after logout.
- **Validation**: All user input is validated to prevent common attacks.
- **CORS & Cookies**: Configured for secure cross-origin requests.

---
