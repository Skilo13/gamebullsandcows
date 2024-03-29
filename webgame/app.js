document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the guess button
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

    // Function to update the history section of the game
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

    // Function to show the win modal
    function showWinModal(code) {
        const winCodeSpan = document.getElementById('winCode');
        winCodeSpan.textContent = code;
        
        const modal = document.getElementById('winModal');
        modal.style.display = 'block';
    }

    // Function to hide the win modal and reset the game
    function hideWinModal() {
        const modal = document.getElementById('winModal');
        modal.style.display = 'none';

        document.getElementById('guess').value = ''; // Clear the guess input field
        document.getElementById('history').innerHTML = ''; // Clear the history
    }

    // Event listener for the play again button
    document.getElementById('playAgainBtn').addEventListener('click', hideWinModal);
});

// Remove the window load event if not needed or ensure it's used for appropriate initialization
