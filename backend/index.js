const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = (process.env.CLIENT_URL)
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({ message: 'SB Stocks API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/trade', require('./routes/tradeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SB Stocks backend listening on port ${PORT}`);
});

