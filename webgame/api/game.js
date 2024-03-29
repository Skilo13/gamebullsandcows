// api/game.js

// Assuming 'readLeaderboard' and 'writeLeaderboard' are defined in 'leaderboard.js'
import { readLeaderboard, writeLeaderboard } from './leaderboard';

let secretCode = generateSecretCode();
let guessesHistory = [];

function generateSecretCode() {
    const digits = '0123456789';
    let code = '';
    while (code.length < 4) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        const digit = digits[randomIndex];
        if (!code.includes(digit)) {
            code += digit;
        }
    }
    return code;
}

function checkForCode(secretCode, guess) {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretCode[i]) {
            bulls++;
        } else if (secretCode.includes(guess[i])) {
            cows++;
        }
    }

    return { bulls, cows, isCorrect: bulls === 4 };
}

async function processGuess(name, guess, leaderboard) {
    const { bulls, cows, isCorrect } = checkForCode(secretCode, guess);
    let tries = guessesHistory.length + 1; // Increment tries
    guessesHistory.push({ guess, bulls, cows });

    if (isCorrect) {
        secretCode = generateSecretCode(); // Generate a new secret code for the next game
        leaderboard[name] = (leaderboard[name] || 0) + tries;
        tries = 0; // Reset tries for the next game
        guessesHistory = []; // Clear history for the new game
    }

    await writeLeaderboard(leaderboard);

    return { tries, bulls, cows, isCorrect };
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, guess } = req.body;
        if (!guess || guess.length !== 4 || new Set(guess).size !== 4) {
            return res.status(400).json({ error: 'Guess must be a 4-digit number with unique digits.' });
        }

        let leaderboard = await readLeaderboard();
        const result = await processGuess(name, guess, leaderboard);

        res.status(200).json({ ...result, history: guessesHistory, leaderboard });
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
