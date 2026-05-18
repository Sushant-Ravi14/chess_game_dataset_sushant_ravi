# ♟️ Chess Match Analytics API

A production-ready, full-stack Chess Match Analytics platform built with Node.js, Express.js, and MongoDB. This backend system provides comprehensive REST APIs for managing chess matches, players, openings, analytics, and statistics — following industry-standard MVC architecture with JWT authentication, aggregation pipelines, and advanced querying capabilities.

---

## Features

- **Full CRUD Operations** — Complete match, player, and opening management
- **Advanced MongoDB Querying** — Filtering, sorting, searching, and pagination
- **JWT Authentication** — Secure login, registration, token refresh, and protected routes
- **Aggregation Pipelines** — Win rates, rating trends, opening success, hourly activity
- **Role-Based Access Control** — Admin and user roles with protected route separation
- **Middleware System** — Auth, logging, rate limiting, and error handling
- **Search System** — Full-text search, fuzzy search, autocomplete, and ECO code lookup
- **Analytics & Statistics** — Victory distribution, color advantage, turn averages, and more
- **Bulk Operations** — Bulk upload, update, delete, archive, and restore
- **System Utilities** — Health checks, database status, performance metrics, cache control
- **API Versioning** — All routes under `/api/v1`
- **Postman Documentation** — Complete API collection with request/response examples

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Environment Config | dotenv |
| API Testing | Postman |
| Architecture | MVC (Model-View-Controller) |

---

## Project Structure

```
chess-analytics-api/
│
├── config/
│   └── db.js                  # MongoDB connection setup
│
├── controllers/
│   ├── matchController.js      # Match request/response logic
│   ├── playerController.js     # Player request/response logic
│   ├── openingController.js    # Opening request/response logic
│   ├── analyticsController.js  # Analytics request/response logic
│   ├── statsController.js      # Statistics request/response logic
│   ├── searchController.js     # Search request/response logic
│   ├── authController.js       # Auth request/response logic
│   └── adminController.js      # Admin request/response logic
│
├── services/
│   ├── matchService.js         # Match business logic
│   ├── playerService.js        # Player business logic
│   ├── openingService.js       # Opening business logic
│   ├── analyticsService.js     # Aggregation pipeline logic
│   └── authService.js          # Auth business logic
│
├── models/
│   ├── Match.js                # Match schema & model
│   ├── Player.js               # Player schema & model
│   ├── Opening.js              # Opening schema & model
│   └── User.js                 # User schema & model
│
├── routes/
│   ├── matchRoutes.js          # Match API routes
│   ├── playerRoutes.js         # Player API routes
│   ├── openingRoutes.js        # Opening API routes
│   ├── analyticsRoutes.js      # Analytics API routes
│   ├── statsRoutes.js          # Statistics API routes
│   ├── searchRoutes.js         # Search API routes
│   ├── authRoutes.js           # Authentication routes
│   ├── adminRoutes.js          # Admin routes
│   └── systemRoutes.js         # System & utility routes
│
├── middlewares/
│   ├── authMiddleware.js       # JWT verification
│   ├── loggerMiddleware.js     # Request logging
│   ├── rateLimiter.js          # Rate limiting
│   ├── errorHandler.js         # Global error handler
│   └── validateInput.js        # Input validation
│
├── .env                        # Environment variables (not committed)
├── .env.example                # Environment variable template
├── .gitignore
├── package.json
├── server.js                   # Entry point
└── README.md
```

---

## Steps to Run the Project Locally

### Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas URI)
- [Postman](https://www.postman.com/) (for API testing)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Sushant-Ravi14/chess_game_dataset_sushant_ravi
cd chess_game_dataset_sushant_ravi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then fill in the required values (see [Environment Variables](#environment-variables) section below).

### 4. Seed the Dataset (Optional but Recommended)

If a seeding script is provided, run it to populate the database with the chess match dataset:

```bash
node scripts/seed.js
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start at:

```
http://localhost:5000
```

### 6. Verify the Setup

Open your browser or Postman and hit the health check endpoint:

```
GET http://localhost:5000/api/v1/health
```

You should receive a `200 OK` response confirming the server and database are live.

---

## Authentication System

All authentication routes are prefixed with `/api/v1/auth`.

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |
| POST | `/auth/logout` | Logout authenticated user | Yes |
| GET | `/auth/profile` | Fetch authenticated user profile | Yes |
| PATCH | `/auth/profile` | Update user profile | Yes |
| DELETE | `/auth/profile` | Delete user account | Yes |
| POST | `/auth/forgot-password` | Request a password reset link | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/verify-email` | Verify user email address | No |
| POST | `/auth/refresh-token` | Refresh expired access token | Yes |

### How JWT Works in This Project

1. User registers or logs in via `/auth/register` or `/auth/login`
2. Server responds with a signed JWT access token
3. Client stores the token and sends it in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your_token>
   ```
4. `authMiddleware.js` verifies the token on every protected request
5. Expired tokens are handled gracefully with a `401 Unauthorized` response
6. Refresh tokens allow session continuity without re-login

---

## API Features

### Match Management (`/api/v1/matches`)

Full CRUD for chess matches including specialized endpoints for moves, PGN notation, FEN position, and engine analysis. Supports archive/restore, trending, latest, and random match retrieval.

### Player Routes (`/api/v1/players`)

Fetch player profiles, match history, ELO rating history, win/loss/draw rates, opening preferences, and head-to-head comparisons. Supports filtering by rating range and ranking by activity or win count.

### Opening Theory (`/api/v1/openings`)

Browse all chess openings with filters for popularity, trending status, ECO code, aggression level, complexity, gambits, beginner-friendliness, and color advantage (white/black).

### Search (`/api/v1/search`)

Powerful search system supporting full-text match/player/opening search, ECO code lookup, move sequence search, fuzzy search, autocomplete suggestions, date range filtering, and checkmate pattern search.

### Filtering (`/api/v1/matches/filter`)

Pre-built filters for: rated/unrated games, white wins, black wins, draws, checkmates, resignations, timeouts, and time controls (bullet, blitz, rapid, classical).

### Pagination

All list endpoints support standard pagination via `?page=1&limit=10`, cursor-based pagination, and infinite scroll modes.

### Sorting

All list endpoints support dynamic sorting via query params (e.g., `?sort=-createdAt`, `?sort=turns`, `?sort=white_rating`).

### Analytics (`/api/v1/analytics`)

Aggregation-powered analytics covering victory distribution, color advantage, average turn count, rated vs casual split, time control usage, rating upset patterns, checkmate/draw/resignation frequency, opening success rates, and hourly activity trends.

### Statistics (`/api/v1/stats`)

Quick count and percentage endpoints: total matches, total players, average rating, top openings, white/black/draw win rates, checkmate rate, timeout rate, and daily/monthly/yearly game counts.

### Bulk Operations (`/api/v1/matches/bulk-*`)

Bulk upload, update, delete, archive, and restore for batch processing of match records.

### Admin Routes (`/api/v1/admin`)

Admin-only access to user management (list, ban, unban), system logs, cache clearing, and protected dashboard. Requires admin role in JWT payload.

### System & Utility (`/api/v1/system`)

Server health, uptime, version, database status, cache status, performance metrics, storage analytics, security events, and system restart/reindex endpoints.

---

## Middleware System

Middleware is chained in the following order for every incoming request:

```
Incoming Request
      ↓
Rate Limiter        → Blocks abuse (max N requests per IP per window)
      ↓
Logger Middleware   → Logs method, URL, timestamp, response time
      ↓
Auth Middleware     → Verifies JWT token on protected routes
      ↓
Validation Layer    → Validates and sanitizes request body/params
      ↓
Controller          → Executes request logic, delegates to service
      ↓
Error Handler       → Catches all thrown errors, returns consistent response
```

| Middleware | File | Purpose |
|---|---|---|
| Auth | `authMiddleware.js` | Verifies JWT, attaches user to `req.user` |
| Logger | `loggerMiddleware.js` | Logs every request with method, URL, and timestamp |
| Rate Limiter | `rateLimiter.js` | Limits requests per IP to prevent API abuse |
| Error Handler | `errorHandler.js` | Global catch-all for consistent error responses |
| Input Validator | `validateInput.js` | Sanitizes and validates all incoming data |

---

## Aggregation Pipelines

The following analytics are powered by MongoDB aggregation pipelines:

| Endpoint | Pipeline Stages Used |
|---|---|
| `/analytics/victory-distribution` | `$group`, `$project`, `$sort` |
| `/analytics/color-advantage` | `$match`, `$group`, `$project` |
| `/analytics/turn-count-average` | `$group` with `$avg` |
| `/analytics/rating-gap-upsets` | `$match`, `$project`, `$sort` |
| `/analytics/opening-success` | `$group`, `$project`, `$sort` |
| `/analytics/hourly-activity` | `$group` by hour, `$sort` |
| `/analytics/checkmate-frequency` | `$match`, `$group`, `$project` |
| `/analytics/time-control-usage` | `$group`, `$sort` |
| `/players/:username/stats` | `$match`, `$group`, `$project` |
| `/players/top-rated` | `$sort`, `$limit` |
| `/stats/top-openings` | `$group`, `$sort`, `$limit` |

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/chess_analytics
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:3000
```
