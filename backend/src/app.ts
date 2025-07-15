import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import teacherRoutes from './routes/teacher.routes';
import bookingRoutes from './routes/booking.routes';
import walletRoutes from './routes/wallet.routes';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wallets', walletRoutes);

app.get('/', (req, res) => {
  res.send('Talkcon Backend API');
});

export default app;
