const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const caseRoutes = require('./routes/caseRoutes');
app.use('/api/cases', caseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
