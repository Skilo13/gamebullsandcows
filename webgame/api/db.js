// db.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    await client.connect();
    const db = client.db('game');
    return db;
}

export async function readLeaderboard() {
    const db = await connectToDatabase();
    return await db.collection('leaderboard').find().toArray();
}

export async function writeLeaderboard(leaderboard) {
    const db = await connectToDatabase();
    await db.collection('leaderboard').updateOne({}, { $set: { leaderboard } }, { upsert: true });
}
