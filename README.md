# Cinematica — MERN Stack Movie Review Platform

Cinematica is a full-stack MERN application for discovering and reviewing movies and TV shows.

## Project Structure

```
cinematica/
├── backend/              # Node.js + Express API
│   ├── models/           # MongoDB schemas (Movie, Review, User)
│   ├── routes/           # API endpoints
│   ├── controllers/       # Business logic (TBD)
│   ├── middleware/        # Custom middleware (TBD)
│   ├── config/            # Database & app config (TBD)
│   └── server.js          # Express app entry point
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client services
│   │   ├── pages/         # Page components (TBD)
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React DOM entry point
│   ├── index.html         # HTML template
│   └── vite.config.js     # Vite config
└── package.json           # Root workspace config
```

## Prerequisites

- Node.js >= 16
- MongoDB (local or Atlas)
- TMDB API Key ([get one here](https://www.themoviedb.org/settings/api))

## Getting Started

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
```

Then edit `backend/.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cinematica
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Start MongoDB
```bash
# macOS (using Homebrew)
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Run Development Server
```bash
npm run dev
```

This starts both backend (port 3000) and frontend (port 5173) concurrently.

## Architecture

- **Backend**: Express API with MongoDB integration
  - `/api/movies` - TMDB data proxy + local movie data
  - `/api/reviews` - User reviews CRUD
  - `/api/users` - User auth & profiles

- **Frontend**: React components with Vite
  - Fetches movie data from backend
  - Displays TMDB content (images, titles, ratings)
  - Ready for user reviews and authentication

## Next Steps

- [ ] Add user authentication (JWT, bcrypt)
- [ ] Implement review creation/editing UI
- [ ] Add user profiles & following
- [ ] Create movie detail pages
- [ ] Add search functionality
- [ ] Set up deployment pipeline

