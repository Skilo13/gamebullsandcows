const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: '9f8d3d4307f8e03d9e5b9c42b8e586a6c4bf89f8a8ee4a4a3b2e4ed3138b6de9',
    resave: false,
    saveUninitialized: false  // Set to false to create a session only when modified
}));

// function generateSecretCode() {
//     const digits = '0123456789';
//     let code = '';
//     while (code.length < 4) {
//         const randomIndex = Math.floor(Math.random() * digits.length);
//         const digit = digits[randomIndex];
//         if (!code.includes(digit)) {
//             code += digit;
//         }
//     }
//     return code;
// }
function generateSecretCode() {
    return '1234';
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

// GET route to provide the current state of the game (tries and history)
app.get('/api/main', (req, res) => {
    // If there's no game in progress, initialize it
    if (typeof req.session.secretCode === 'undefined' || req.session.isCorrect) {
        req.session.secretCode = generateSecretCode();
        req.session.guessesHistory = [];
        req.session.tries = 0;
        req.session.isCorrect = false;
    }

    // Respond with the current tries and history
    res.status(200).json({
        tries: req.session.tries,
        history: req.session.guessesHistory
    });
});

// POST route to process the guess and update the game state
app.post('/api/main', (req, res) => {
    if (typeof req.session.secretCode === 'undefined' || req.session.isCorrect) {
        req.session.secretCode = generateSecretCode();
        req.session.guessesHistory = [];
        req.session.tries = 0; // Initialize tries here
        req.session.isCorrect = false; // Reset this flag for a new game
    }

    const { guess } = req.body;

    if (!guess || guess.length !== 4 || new Set(guess).size !== 4) {
        return res.status(400).json({ error: 'Guess must be a 4-digit number with unique digits.' });
    }

    req.session.tries++;
    const result = checkForCode(req.session.secretCode, guess);
    req.session.guessesHistory.push({ guess, ...result });

    if (result.isCorrect) {
        req.session.isCorrect = true;
    }

    // Save the session before sending the response
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).send('An error occurred');
        }
        res.status(200).json({ ...result, history: req.session.guessesHistory, tries: req.session.tries });
});

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
