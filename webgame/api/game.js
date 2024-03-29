// api/game.js

let secretCode = generateSecretCode();

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

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { guess } = req.body;

        if (!guess || guess.length !== 4 || new Set(guess).size !== 4) {
            return res.status(400).json({ error: 'Guess must be a 4-digit number with unique digits.' });
        }

        const result = checkForCode(secretCode, guess);

        if (result.isCorrect) {
            // Reset secret code for the next game, in a real app you might handle this differently
            secretCode = generateSecretCode();
        }

        res.status(200).json(result);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}