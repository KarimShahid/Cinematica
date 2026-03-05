## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Setup Instructions

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd cinematica
```

2. **Create environment file**
```bash
   # Create server directory and copy environment template
   mkdir -p server
   cp .env.example server/.env
```

3. **Configure environment variables**
   
   Edit `server/.env` and add your credentials:
   - `TMDB_API_KEY`: Your TMDB API key
   - `JWT_SECRET`: A strong random string (for production)
   - `REFRESH_SECRET`: Another strong random string (for production)

4. **Run the application**
```bash
   docker-compose up -d
```

5. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5001
   - MongoDB: localhost:27017

### Stopping the Application
```bash
# Stop containers
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

### Troubleshooting

**MongoDB connection issues:**
- Ensure `MONGODB_URI=mongodb://db:27017/cinematica` in your `.env` file

**Port conflicts:**
- If port 80 is in use, change `ports: - "80:80"` to `ports: - "3000:80"` in docker-compose.yml
- Access frontend at http://localhost:3000

**Image pull issues:**
- Run `docker-compose pull` to update to latest images
```

## Key Points:

1. **`.env.example`** - Users copy this to `server/.env` and fill in their values
2. **`docker-compose.yml`** - No `build:` context, only `image:` from Docker Hub
3. **Directory structure** users need:
```
   cinematica/
   ├── docker-compose.yml
   ├── .env.example
   └── server/
       └── .env  (created by user from .env.example)