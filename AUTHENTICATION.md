# Cinematica Authentication Guide

## Overview

The authentication system uses **JWT (JSON Web Tokens)** with refresh tokens for secure, stateless authentication following industry best practices.

## Features

✅ **Secure Password Hashing** - bcryptjs with salt rounds  
✅ **JWT Authentication** - Short-lived access tokens + long-lived refresh tokens  
✅ **Session Management** - Automatic token refresh and expiry handling  
✅ **Persistent Auth** - localStorage-based session persistence  
✅ **Protected Routes** - Middleware for backend, components for frontend  
✅ **Error Handling** - Comprehensive validation and user feedback  

## How It Works

### Backend Flow

1. **Signup/Login**
   - User submits email + password
   - Password hashed with bcryptjs (10 salt rounds)
   - Two tokens generated:
     - **Access Token**: 15 minutes expiry
     - **Refresh Token**: 7 days expiry
   - User data stored in `server/users.json` (can replace with database)

2. **Protected Endpoints**
   - Client sends: `Authorization: Bearer <accessToken>`
   - Middleware verifies token signature and expiry
   - If valid: request proceeds with `req.userId`
   - If expired: client uses refresh token to get new tokens

3. **Token Refresh**
   - Client sends refresh token
   - Server verifies and issues new token pair
   - Old refresh token becomes invalid after new one issued

### Frontend Flow

1. **Login/Signup**
   - User enters credentials
   - `AuthContext` sends POST request
   - Tokens stored in localStorage
   - User redirected to home page

2. **Session Persistence**
   - On app load, tokens retrieved from localStorage
   - If valid tokens exist, user stays logged in
   - Automatic logout on token expiry

3. **API Calls**
   - Interceptor adds `Authorization` header to all requests
   - If 401 error: refresh token automatically
   - Retry request with new token

## API Endpoints

### Authentication Routes

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me (protected)
```

### Request/Response Examples

**Signup**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

Response:
```json
{
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Login**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

**Refresh Token**
```bash
curl -X POST http://localhost:5001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'
```

**Get Current User** (Protected)
```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

## File Structure

```
Backend:
├── server/
│   ├── index.js           # Main server + auth routes
│   ├── auth.js            # JWT generation & verification
│   ├── db.js              # User database operations
│   ├── users.json         # User data (auto-created)
│   └── .env               # Secrets (update in production)

Frontend:
├── client/src/
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── hooks/
│   │   └── useAuth.js            # useAuth custom hook
│   ├── components/
│   │   ├── Header.jsx            # Updated with auth UI
│   │   └── ProtectedRoute.jsx     # Route protection
│   ├── pages/
│   │   ├── LoginPage.jsx         # Login form
│   │   └── SignupPage.jsx        # Signup form
│   └── App.jsx                   # AuthProvider wrapper
```

## Security Features

### 1. Password Security
- Bcryptjs with 10 salt rounds
- Passwords never stored in plaintext
- Never transmitted without HTTPS (use in production)

### 2. Token Security
- JWT signed with secret key
- Access tokens short-lived (15 min)
- Refresh tokens long-lived (7 days)
- Tokens stored in localStorage (production: use httpOnly cookies)

### 3. Middleware Protection
```javascript
// Any route using authMiddleware requires valid token
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  // req.userId is automatically set by middleware
});
```

### 4. Frontend Protection
```javascript
// ProtectedRoute prevents unauthenticated access
<Route path="/protected" element={
  <ProtectedRoute>
    <ProtectedPage />
  </ProtectedRoute>
} />
```

## Environment Variables

**server/.env** (Update these in production!)
```
PORT=5001
TMDB_API_KEY=your_tmdb_key
JWT_SECRET=your-secret-key-min-32-chars
REFRESH_SECRET=your-refresh-key-min-32-chars
```

⚠️ **IMPORTANT**: Never commit real secrets to git. Use:
- Environment variables
- Secret management service (AWS Secrets Manager, HashiCorp Vault)
- .env.local (git-ignored)

## Usage Examples

### Using useAuth Hook
```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={() => navigate('/login')}>Sign In</button>;
  }

  return (
    <div>
      Welcome {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected API Calls
```javascript
// AuthContext automatically adds Authorization header
async function fetchUserData() {
  const res = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return res.json();
}
```

## Production Recommendations

1. **Use HTTPS Only**
   - Tokens transmitted over encrypted connection

2. **Replace localStorage with httpOnly Cookies**
   - Prevents XSS attacks from accessing tokens
   - Automatically sent with requests

3. **Use Strong Secrets**
   - JWT_SECRET: minimum 32 random characters
   - Store in secure vault, not in code

4. **Replace JSON File Database**
   - MongoDB, PostgreSQL, Firebase, etc.
   - Supports proper scaling and backup

5. **Add Email Verification**
   - Send confirmation email on signup
   - Verify before account activation

6. **Implement Rate Limiting**
   - Prevent brute force attacks
   - Use express-rate-limit

7. **Add CORS Restrictions**
   - Only allow your frontend domain
   - Currently set to allow all origins (for dev)

8. **Token Rotation**
   - Invalidate old refresh tokens
   - Prevent token reuse attacks

## Troubleshooting

**"Invalid token" error**
→ Token expired or corrupted. Clear localStorage and login again.

**"User already exists"**
→ Email already registered. Use login or different email.

**"CORS error on login"**
→ Ensure server running on port 5001 and Vite proxy configured.

**Tokens not persisting**
→ Check browser localStorage in DevTools (F12 → Storage → Local Storage)

## Testing

```bash
# Install dependencies
npm run install:all

# Start servers
npm run dev

# Test signup
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Visit:
- Frontend: http://localhost:3001
- Backend: http://localhost:5001
- Sign up or login to test the system
