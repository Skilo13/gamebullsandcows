const { Pool } = require('pg');

// Connect to the PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
});

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Query the database to get the top scores
      const result = await pool.query('SELECT name, MIN(tries) AS tries FROM leaderboard GROUP BY name ORDER BY min_tries ASC LIMIT 10;');
      res.status(200).json(result.rows);
    } catch (error) {
      // If there's a database error, log it and send a server error response
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to load leaderboard' });
    }
  } else if (req.method === 'POST') {
    try {
      // Extract the name and tries from the request body
      const { name, tries } = req.body;
      // Insert the new score into the database
      await pool.query('INSERT INTO leaderboard (name, tries) VALUES ($1, $2)', [name, tries]);
      res.status(201).json({ message: 'Score saved to leaderboard' });
    } catch (error) {
      // If there's a database error, log it and send a server error response
      console.error('Error saving to leaderboard:', error);
      res.status(500).json({ error: 'Failed to save score' });
    }
  } else {
    // If the HTTP method is not GET or POST, return a 405 Method Not Allowed error
    res.status(405).json({ error: 'Method not allowed' });
  }
};
