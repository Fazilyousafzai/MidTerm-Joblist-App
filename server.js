// server.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/jobListings')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Job Schema
const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  company: String,
  location: String,
  description: String,
  requirements: String,
});

const Job = mongoose.model('Job', jobSchema);

// Middleware
app.use(express.json());

// API Routes
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/fetch-jobs', async (req, res) => {
  try {
    const appId = '16d60490'; // Your Adzuna app_id
    const appKey = 'becd5238dd34e8959abab90a0d2e14e6'; // Your Adzuna app_key
    const searchQuery = 'software developer'; // Customize as needed
    const location = 'us'; // Country code (e.g., 'us', 'gb')
    const url = `https://api.adzuna.com/v1/api/jobs/${location}/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(searchQuery)}&results_per_page=20`;

    const response = await axios.get(url, {
      headers: { 'Accept': 'application/json' }
    });
    const jobData = response.data.results;

    // Map Adzuna data to your schema
    const jobs = jobData.map(job => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      requirements: job.description, // Adzuna doesn't provide a separate requirements field
    }));

    // Clear existing jobs and insert new ones
    await Job.deleteMany({});
    await Job.insertMany(jobs);

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs from Adzuna API:', error.message);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});