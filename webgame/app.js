document.getElementById('guessBtn').addEventListener('click', async () => {
    const guess = document.getElementById('guess').value;
    const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess })
    });
    const data = await response.json();

    document.getElementById('response').textContent = `Bulls: ${data.bulls}, Cows: ${data.cows}`;
});
