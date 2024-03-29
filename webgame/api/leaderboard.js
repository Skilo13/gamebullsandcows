import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM leaderboard ORDER BY tries ASC LIMIT 10`;
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({ message: 'Error fetching leaderboard' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, tries } = req.body;
      await sql`INSERT INTO leaderboard (name, tries) VALUES (${name}, ${tries})`;
      return res.status(201).json({ message: 'Score added to leaderboard' });
    } catch (error) {
      console.error('Error saving to leaderboard:', error);
      return res.status(500).json({ message: 'Error saving to leaderboard' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
