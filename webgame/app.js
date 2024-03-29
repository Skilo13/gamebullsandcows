document.getElementById('guessBtn').addEventListener('click', async () => {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();
    const guessInput = document.getElementById('guess');
    const guess = guessInput.value;
    const warningText = document.getElementById('warningText');

    if (!name) {
        warningText.textContent = 'Please enter your name.';
        return;
    }

    if (!guess.match(/^\d{4}$/) || new Set(guess).size !== 4) {
        warningText.textContent = 'Please enter a 4-digit number with unique digits.';
        return;
    } else {
        warningText.textContent = '';  // Clear the warning if the input is valid
    }

    try {
        const response = await fetch('http://https://gamebullsandcows.vercel.app/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, guess })
        });
        const data = await response.json();

        // Check if there is an error in the response
        if (data.error) {
            warningText.textContent = data.error;
        } else {
            document.getElementById('response').textContent = `Bulls: ${data.bulls}, Cows: ${data.cows}`;
            updateHistory(data.history);
            updateLeaderboard(data.leaderboard);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        warningText.textContent = 'There was a problem processing your guess. Please try again.';
    }

    guessInput.value = '';  // Clear input field after processing
});

function updateHistory(history) {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = '';  // Clear existing history

    history.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.textContent = `Guess: ${entry.guess}, Bulls: ${entry.bulls}, Cows: ${entry.cows}`;
        historyElement.appendChild(entryElement);
    });
}

function updateLeaderboard(leaderboard) {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';  // Clear existing leaderboard

    leaderboard.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.textContent = `${index + 1}. ${entry.name}: ${entry.tries} tries`;
        leaderboardElement.appendChild(entryElement);
    });
}
