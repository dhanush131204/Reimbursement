import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import claimRoutes from './routes/claimRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running perfectly' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
