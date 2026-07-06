const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Stock = require('../models/Stock');
const sampleStocks = require('./sampleStocks');

dotenv.config();

const seed = async () => {
  await connectDB();

  for (const stock of sampleStocks) {
    await Stock.findOneAndUpdate({ symbol: stock.symbol }, stock, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  const adminEmail = 'admin@sbstocks.com';
  const demoEmail = 'demo@sbstocks.com';

  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: 'SB Admin',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
      virtualBalance: 1000000,
    });
  }

  if (!(await User.findOne({ email: demoEmail }))) {
    await User.create({
      name: 'Demo Trader',
      email: demoEmail,
      password: 'Demo@123',
      role: 'user',
      virtualBalance: 100000,
    });
  }

  console.log('Sample stocks and demo accounts are ready.');
  console.log('Admin: admin@sbstocks.com / Admin@123');
  console.log('User: demo@sbstocks.com / Demo@123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
