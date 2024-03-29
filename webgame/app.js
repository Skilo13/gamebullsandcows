document.getElementById('guessBtn').addEventListener('click', async () => {
    // The name is no longer needed since the leaderboard has been removed
    // const nameInput = document.getElementById('name');
    // const name = nameInput.value.trim();
    
    const guessInput = document.getElementById('guess');
    const guess = guessInput.value;
    const warningText = document.getElementById('warningText');

    // The name validation can be removed as well
    // if (!name) {
    //     warningText.textContent = 'Please enter your name.';
    //     return;
    // }

    if (!guess.match(/^\d{4}$/) || new Set(guess).size !== 4) {
        warningText.textContent = 'Please enter a 4-digit number with unique digits.';
        return;
    } else {
        warningText.textContent = '';
    }

    try {
        // Since the name is no longer used, we only send the guess
        console.log('Sending guess:', { guess });
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess })
        });
        const data = await response.json();
        console.log('Received data:', data);

        if (data.error) {
            warningText.textContent = data.error;
        } else {
            // Update the text content to reflect only the guess results
            document.getElementById('response').textContent = `Bulls: ${data.bulls}, Cows: ${data.cows}`;
            updateHistory(data.history);
            // Since leaderboard is removed, no need to update it
            // updateLeaderboard(data.leaderboard);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        warningText.textContent = 'There was a problem processing your guess. Please try again.';
    }

    // Clear input field after processing
    guessInput.value = '';
});

function updateHistory(history) {
    const historyElement = document.querySelector('.history-entries');
    historyElement.innerHTML = '';  // Clear existing history

    history.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'history-entry';
        entryElement.textContent = `Guess: ${entry.guess}, Bulls: ${entry.bulls}, Cows: ${entry.cows}`;
        historyElement.appendChild(entryElement);
    });
}

window.addEventListener('load', () => {
    // Clear specific storage or keys
    localStorage.removeItem('historyKey'); // Replace 'historyKey' with the actual key used for storing history
    // Or sessionStorage.removeItem('historyKey');
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('yourFormId').reset();
    // or if you want to clear specific input
    document.getElementById('yourInputId').value = '';
});

// Since leaderboard functionality is removed, this function is no longer needed
// function updateLeaderboard(leaderboard) {
//     // ...
// }
