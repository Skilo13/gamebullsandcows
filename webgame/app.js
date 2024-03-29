document.getElementById('guessBtn').addEventListener('click', async () => {
    const guessInput = document.getElementById('guess');
    const guess = guessInput.value;
    guessInput.value = '';  // This clears the input field, which is correct.

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess })
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        document.getElementById('response').textContent = `Bulls: ${data.result.bulls}, Cows: ${data.result.cows}`;
        updateHistory(data.history);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('There was a problem processing your guess. Please try again.');
    }
});

function updateHistory(history) {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = '';  // Clear existing history

    history.forEach((entry) => {
        const entryElement = document.createElement('div');
        entryElement.textContent = `Guess: ${entry.guess}, Bulls: ${entry.result.bulls}, Cows: ${entry.result.cows}`;
        historyElement.appendChild(entryElement);
    });
}
