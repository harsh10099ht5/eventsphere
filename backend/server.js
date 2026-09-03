const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, testConnection } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

testConnection();

app.get('/', (req, res) => {
  res.json({ message: 'EventSphere Backend is running' });
});

// STEP 2: Get all events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events ORDER BY event_date ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// ML Event Recommendation
app.post('/api/recommend', async (req, res) => {
  try {
    const { interest } = req.body;

    if (!interest) {
      return res.status(400).json({
        error: 'Interest is required'
      });
    }

    const response = await fetch('http://127.0.0.1:5001/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ interest })
    });

    const data = await response.json();

    res.json(data);

  } catch (err) {
    console.error('ML API Error:', err);

    res.status(500).json({
      error: 'ML recommendation service unavailable'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});