import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import notesRouter from './routes/notes.js';


const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Static to serve audio
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => res.send('Voice Notes + GenAI API running'));

// DB Connect + Server Listen
async function start() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'voice' });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}
start();
