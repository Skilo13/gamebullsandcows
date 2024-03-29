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

    guessInput.value = '';  // Clear input after validation

    // Fetch and update logic...
    // After getting the result, update the leaderboard
    updateLeaderboard(name, data.result.tries);
});

function updateHistory(history) {
    // History update logic...
}

function updateLeaderboard(name, tries) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, tries });
    leaderboard.sort((a, b) => a.tries - b.tries);  // Sort by tries, ascending
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'leaderboard-entry';
        entryElement.textContent = `${index + 1}. ${entry.name}: ${entry.tries} tries`;
        leaderboardElement.appendChild(entryElement);
    });
}
