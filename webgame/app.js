document.getElementById('guessBtn').addEventListener('click', async () => {
    const guessInput = document.getElementById('guess');
    const guess = guessInput.value.trim();
    const warningText = document.getElementById('warningText');

    if (!guess.match(/^\d{4}$/) || new Set(guess).size !== 4) {
        warningText.textContent = 'Please enter a 4-digit number with unique digits.';
        return;
    } else {
        warningText.textContent = '';
    }

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess })
        });
        const data = await response.json();

        if (data.error) {
            warningText.textContent = data.error;
        } else {
            document.getElementById('response').textContent = `Bulls: ${data.bulls}, Cows: ${data.cows}`;
            updateHistory(data.history);
            
            if (data.isCorrect) {
                showWinModal(guess);
            }
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

function showWinModal(code) {
    const winCodeSpan = document.getElementById('winCode');
    winCodeSpan.textContent = code;
    
    const modal = document.getElementById('winModal');
    modal.style.display = 'block';
}

function hideWinModal() {
    const modal = document.getElementById('winModal');
    modal.style.display = 'none';

    // Reset game state if necessary here
    document.getElementById('guess').value = ''; // Clear the guess input field
    document.getElementById('history').innerHTML = ''; // Clear the history
}

document.getElementById('playAgainBtn').addEventListener('click', hideWinModal);

window.addEventListener('load', () => {
    // Perform necessary initialization, like clearing storage or resetting form/input fields
    document.getElementById('yourFormId').reset();  // Replace 'yourFormId' with the actual form ID
    localStorage.removeItem('historyKey'); // Replace 'historyKey' with the actual key used for storing history
});
