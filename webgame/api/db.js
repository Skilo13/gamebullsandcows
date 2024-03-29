import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Set in your Vercel environment variables
let dbClient;

async function connectToDatabase() {
    if (!dbClient) {
        dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await dbClient.connect();
    }
    return dbClient.db('your_database_name'); // Replace with your database name
}

export async function readLeaderboard() {
    try {
        const db = await connectToDatabase();
        const leaderboard = await db.collection('leaderboard').findOne({});
        return leaderboard || {};
    } catch (error) {
        console.error('Error reading from the database:', error);
        return {}; // Fallback to an empty object
    }
}

export async function writeLeaderboard(leaderboard) {
    try {
        const db = await connectToDatabase();
        await db.collection('leaderboard').updateOne({}, { $set: { leaderboard } }, { upsert: true });
    } catch (error) {
        console.error('Error writing to the database:', error);
    }
}
