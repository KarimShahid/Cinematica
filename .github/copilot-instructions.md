# Cinematica MERN Stack — Copilot Instructions

## Project Overview

Cinematica is a full-stack MERN application for discovering, reviewing, and rating movies. The project fetches content from TMDB and allows users to create reviews.

**Stack**: React 18 + Vite (frontend) | Express + MongoDB (backend) | TMDB API integration

## Architecture & Data Flow

### Backend (Node.js/Express)
- **Port**: 3000
- **Entry**: `backend/server.js` — Express app with CORS, JSON parsing, MongoDB connection
- **Database**: MongoDB with three main schemas:
  - `Movie` — TMDB metadata (tmdbId, title, posters, rating)
  - `Review` — User-generated reviews (userId, movieId, rating 1-10, text)
  - `User` — Accounts (username, email, password hash needed)
- **Routes**:
  - `/api/movies/*` — Proxy TMDB endpoints (now-playing, popular, details)
  - `/api/reviews/*` — CRUD reviews, filtered by movieId
  - `/api/users/*` — Auth, profiles (password hashing TODO)

### Frontend (React + Vite)
- **Port**: 5173
- **Entry**: `frontend/src/main.jsx` → App component
- **Components**:
  - `Header` — Navigation
  - `Hero` — Now-playing banner carousel
  - `MovieGrid` — Popular movies/TV grid
  - `Footer` — Credits
- **Services**: `frontend/src/services/movieService.js` — Axios calls to `/api/movies`
- **Styling**: CSS variables in `frontend/src/index.css` (dark theme with #ff5a5f accent)

**Frontend ↔ Backend**: Vite proxy `/api/*` → localhost:3000

## Critical Developer Workflows

### Development
```bash
npm run install-all      # Install all dependencies
npm run dev             # Start frontend + backend concurrently
npm start               # Production mode (both services)
```

### Backend Only
```bash
cd backend
npm run dev             # Nodemon watch mode
npm start               # Node production
```

### Frontend Only
```bash
cd frontend
npm run dev             # Vite dev server with HMR
npm run build           # Production bundle to dist/
npm run preview         # Preview production build
```

### Environment Setup
- Copy `.env.example` → `.env` in both `backend/` and root
- **TMDB_API_KEY** required (get from [TMDB settings](https://www.themoviedb.org/settings/api))
- **MONGODB_URI** must be set (local: `mongodb://localhost:27017/cinematica` or Atlas URL)

## Project-Specific Patterns

### API Conventions
- All backend endpoints return JSON with `results[]` for lists
- Movie responses use TMDB shape: `{id, title, poster_path, backdrop_path, release_date, overview}`
- Error responses: `{error: "message", message: "details"}`

### Database Patterns
- Always reference TMDB ID (`tmdbId`) as unique identifier for movies
- Reviews use MongoDB `_id` + reference `userId` & `movieId` by ObjectId
- Timestamps: `createdAt`, `updatedAt` with `default: Date.now`

### Frontend Patterns
- Conditional rendering for loading states (see `Hero.jsx` `useState` + `useEffect`)
- Image fallback: use `backdrop_path || poster_path` for missing images
- External links open in new tab: `window.open(url, '_blank')`
- CSS grid: `repeat(auto-fill, minmax(140px, 1fr))` for responsive poster grids

### Security TODOs
- Backend: Hash passwords with bcrypt before saving User
- Frontend: Add JWT token storage & auth context
- API: Implement protected routes (`/api/reviews POST` requires auth)

## Key Files to Know

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app config, routes registration, MongoDB connection |
| `backend/models/*` | Mongoose schemas for Movie, Review, User |
| `backend/routes/movies.js` | TMDB proxy endpoints |
| `frontend/src/App.jsx` | Root React component, layout wrapper |
| `frontend/src/services/movieService.js` | Centralized API client, retry logic here |
| `frontend/src/index.css` | Global styles, dark theme CSS variables |
| `vite.config.js` | Vite setup + `/api` proxy config |

## Integration Points & External APIs

- **TMDB API** (read-only): `https://api.themoviedb.org/3`
  - Endpoints: `/movie/now_playing`, `/movie/popular`, `/tv/popular`, `/movie/{id}`
  - Auth: `?api_key=...` query param (in `.env`)
  - Images: CDN prefix `https://image.tmdb.org/t/p/w500`
- **MongoDB**: Local or Atlas connection string in `.env`

## Common Tasks & Where to Implement

| Task | Location |
|------|----------|
| Add new API endpoint | `backend/routes/*.js` — import in `server.js` |
| Add React page | `frontend/src/pages/NewPage.jsx` → import in `App.jsx` routing |
| Change theme colors | `frontend/src/index.css` — edit `:root` CSS vars |
| Add TMDB API call | `frontend/src/services/movieService.js` + use in component |
| Add database model | `backend/models/NewModel.js` + route in `backend/routes/*.js` |
| Add authentication | Backend: hash in `User` model; Frontend: JWT context provider |

## Quick Debugging Tips

- **Backend won't start**: Check MongoDB connection (`MONGODB_URI` in `.env`)
- **API 404**: Ensure route is imported in `server.js`
- **CORS errors**: Check `cors()` middleware in `server.js`
- **Components not rendering**: Check Vite proxy setup in `frontend/vite.config.js` `/api` target
- **TMDB images missing**: Verify `IMAGE_BASE_URL` in `.env` and `poster_path` field exists

## Future Roadmap

- User authentication with JWT + login page
- Review detail page with edit/delete
- User profile pages
- Search & filtering
- Deployment: Backend → Heroku/Railway, Frontend → Vercel/Netlify
