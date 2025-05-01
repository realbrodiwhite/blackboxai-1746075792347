const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const citationRoutes = require('./routes/citations');
const syncRoutes = require('./routes/sync');
const bulkSyncRoutes = require('./routes/bulkSync');
const syncScheduler = require('./syncScheduler');
const reportingRoutes = require('./routes/reporting');

app.use('/api/auth', authRoutes);
app.use('/api/citations', citationRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/bulk-sync', bulkSyncRoutes);
app.use('/api/reporting', reportingRoutes);

app.get('/', (req, res) => {
  res.send('Business Citation Manager API is running');
});

// Start sync scheduler
syncScheduler;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});
