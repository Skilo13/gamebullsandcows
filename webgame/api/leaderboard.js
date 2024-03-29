const leaderboardPath = '/tmp/leaderboard.json';  // Temporary storage in Vercel's environment

export async function readLeaderboard() {
    // Read the leaderboard from the file
    try {
        const data = await fs.promises.readFile(leaderboardPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return an empty object
        return {};
    }
}

export async function writeLeaderboard(leaderboard) {
    // Write the updated leaderboard to the file
    const data = JSON.stringify(leaderboard, null, 2);
    await fs.promises.writeFile(leaderboardPath, data, 'utf8');
}
