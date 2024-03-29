document.addEventListener('DOMContentLoaded', () => {
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

        guessInput.value = '';  // Clear input field after processing
    });

    function updateHistory(history) {
        const historyEntriesElement = document.querySelector('.history-entries');
        historyEntriesElement.innerHTML = '';  // Clear existing history entries

        history.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'history-entry';
            entryElement.textContent = `Guess: ${entry.guess}, Bulls: ${entry.bulls}, Cows: ${entry.cows}`;
            historyEntriesElement.appendChild(entryElement);
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
        const guessInput = document.getElementById('guess');
        guessInput.value = '';  // Clear the guess input field

        // To ensure that the history is not cleared completely, fetch or initialize the new history
        // This should be handled by fetching new history data or initializing it if the game is reset
    }

    document.getElementById('playAgainBtn').addEventListener('click', () => {
        hideWinModal();

        // Reset the game's state and prepare for a new game
        // This may involve fetching new game state from the server or resetting local variables
        updateHistory([]);  // Clear the history view, or fetch new history as needed
    });
});
