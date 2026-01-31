# Cinematica

A movie & TV series review community — like [Fragrantica](https://www.fragrantica.com) for cinema. Browse, discover, and share reviews with fellow film lovers.

Data powered by [The Movie Database (TMDB)](https://www.themoviedb.org/).

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start both backend and frontend
npm run dev
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000  

> If port 5000 is in use, stop the process using it or change `PORT` in `server/.env`.

## Project Structure

```
cinematica/
├── client/          # React + Vite frontend
│   └── src/
│       ├── api/     # TMDB API helpers
│       ├── components/
│       └── pages/
└── server/          # Express backend (TMDB proxy)
```

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **Backend:** Express, CORS
- **Data:** TMDB API

## Environment

Create `server/.env` with:

```
PORT=5000
TMDB_API_KEY=your_tmdb_api_key
```
