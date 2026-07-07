# Chess Game Analytics API (Backend)

## Overview
This is the backend server for the Chess Game Analytics Full Stack Dashboard project. It is built using Node.js, Express.js, and MongoDB. It provides a robust, scalable, and secure API to serve chess match data, player statistics, system analytics, and user authentication.

## Project Setup Steps

1. **Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed.
2. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Update the variables (e.g., `MONGO_URI`, `JWT_SECRET`, `PORT`).
4. **Run the Server:**
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## Folder Structure

The backend strictly follows the **MVC (Model-View-Controller)** architecture and is organized as follows:

- `config/` - Database and external service configuration.
- `controllers/` - Request handlers containing core operational logic.
- `middlewares/` - Custom middleware (Authentication, Validation, Error Handling).
- `models/` - Mongoose schemas representing MongoDB collections.
- `routes/` - API route definitions and endpoint mappings.
- `services/` - Business logic and data aggregation pipelines.
- `utils/` - Reusable helper functions (AsyncHandler, API Responses).

## Key Features Implemented

- **RESTful Architecture:** Fully versioned APIs (`/api/v1/...`).
- **Authentication & Authorization:** Secure JWT-based login/registration with Role-Based Access Control (Admin/User).
- **Advanced Aggregation Pipelines:** Complex MongoDB queries to power real-time analytics (victory distribution, average turn counts, etc.).
- **Robust Search & Filtering:** Filter matches by eco, rated/casual, time control, etc., along with fuzzy search and autocomplete capabilities.
- **Pagination & Sorting:** Built-in `scroll` and `infinite` routing for efficiently rendering large datasets on the frontend.
- **Security Best Practices:** Helmet for HTTP headers, CORS policies, Rate Limiting, and input validation.
- **Standardized Error Handling:** Global API error handlers and uniform response formatting (`sendSuccess`, `sendError`).
- **Performance Optimized:** Proper MongoDB schema indexing and projection applied to ensure fast query times.

## API Documentation
The complete Postman Collection is available in the root folder as `Chess_Analytics_API_Postman_Collection.json`. You can import this into Postman to explore and test all available endpoints.
