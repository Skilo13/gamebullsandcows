import { readLeaderboard, writeLeaderboard } from '../db';

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
    let tries = guessesHistory.length + 1;
    guessesHistory.push({ guess, bulls, cows });

    if (isCorrect) {
        secretCode = generateSecretCode();
        leaderboard[name] = (leaderboard[name] || 0) + tries;
        tries = 0;
        guessesHistory = [];
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

        let leaderboard;
        try {
            leaderboard = await readLeaderboard();
        } catch (error) {
            console.error('Error reading leaderboard:', error);
            return res.status(500).json({ error: 'Failed to read leaderboard' });
        }


        res.status(200).json({ ...result, history: guessesHistory, leaderboard });
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
