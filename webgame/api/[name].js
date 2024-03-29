const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { name, tries } = req.body;
    try {
      await pool.query('INSERT INTO leaderboard (name, tries) VALUES ($1, $2)', [name, tries]);
      res.status(201).json({ message: 'Score saved to leaderboard' });
    } catch (error) {
      console.error('Error saving to leaderboard:', error);
      res.status(500).json({ error: 'Failed to save score' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
