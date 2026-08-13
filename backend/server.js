const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 PDF uploads
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const caseRoutes = require('./routes/caseRoutes');
const aiRoutes = require('./routes/aiRoutes');
const documentRoutes = require('./routes/documentRoutes');
const legalServicesRoutes = require('./routes/legalServicesRoutes');
const authRoutes = require('./routes/authRoutes');
const myCaseRoutes = require('./routes/myCaseRoutes');

app.use('/api/cases', caseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/legal-services', legalServicesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/my-cases', myCaseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
