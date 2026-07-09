require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const matchRoutes = require('./routes/matchRoutes');
const playerRoutes = require('./routes/playerRoutes');
const openingRoutes = require('./routes/openingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const systemRoutes = require('./routes/systemRoutes');
const systemController = require('./controllers/systemController');
const optionsHeadMiddleware = require('./middlewares/optionsHeadMiddleware');

const app = express();

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(optionsHeadMiddleware);
app.use(loggerMiddleware);
app.use(rateLimiter);

app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/players', playerRoutes); 
app.use('/api/v1/openings', openingRoutes); 
app.use('/api/v1/search', searchRoutes); 
app.use('/api/v1/analytics', analyticsRoutes); 
app.use('/api/v1/stats', statsRoutes); 
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/middleware', middlewareRoutes);
app.use('/api/v1/protected', protectedRoutes);
app.use('/api/v1/system', systemRoutes);
app.get('/api/v1/health', systemController.getHealth);

app.use((req, res, next) => {
  const err = new Error(`Route not found - [${req.method}] ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
