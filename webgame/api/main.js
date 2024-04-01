const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: '9f8d3d4307f8e03d9e5b9c42b8e586a6c4bf89f8a8ee4a4a3b2e4ed3138b6de9',
    resave: false,
    saveUninitialized: false  // Set to false to create a session only when modified
}));

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

app.post('/api/main', (req, res) => {
    // Generate a new secret code if there isn't one for the session or if the previous game was completed
    if (!req.session.secretCode || req.session.isCorrect) {
        req.session.secretCode = generateSecretCode();
        req.session.guessesHistory = [];
        req.session.isCorrect = false; // Reset the game completion flag
    }

    const { guess } = req.body;

    if (!guess || guess.length !== 4 || new Set(guess).size !== 4) {
        return res.status(400).json({ error: 'Guess must be a 4-digit number with unique digits.' });
    }

    const result = checkForCode(req.session.secretCode, guess);
    req.session.guessesHistory.push({ guess, ...result });

    if (result.isCorrect) {
        req.session.isCorrect = true;
    }

    res.status(200).json({ ...result, history: req.session.guessesHistory });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
