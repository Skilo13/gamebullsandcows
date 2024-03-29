// api/game.js

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

function processGuess(guess) {
    const result = checkForCode(secretCode, guess);
    guessesHistory.push({ guess, ...result });

    if (result.isCorrect) {
        // Generate a new secret code for the next game and clear history
        secretCode = generateSecretCode();
        guessesHistory = [];
    }

    return result;
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { guess } = req.body;

        if (!guess || guess.length !== 4 || new Set(guess).size !== 4) {
            return res.status(400).json({ error: 'Guess must be a 4-digit number with unique digits.' });
        }

        const result = processGuess(guess);
        res.status(200).json({ ...result, history: guessesHistory });
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
