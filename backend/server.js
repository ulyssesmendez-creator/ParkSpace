import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import listingRoutes from './routes/listing.route.js'; // or routes if plural

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS FIRST
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ JSON middleware
app.use(express.json());

// ✅ Connect routes
app.use("/api/listings", listingRoutes);

// ✅ Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
