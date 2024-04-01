document.addEventListener('DOMContentLoaded', () => {
    // Select header buttons
    const gameSectionBtn = document.getElementById('gameSectionBtn');
    const instructionsSectionBtn = document.getElementById('instructionsSectionBtn');

    // Select sections to switch between
    const gameSection = document.getElementById('game');
    const instructionsSection = document.getElementById('instructions'); // Updated ID for instructions section

    // Add event listener to the game section button
    gameSectionBtn.addEventListener('click', () => {
        gameSection.style.display = 'block';
        instructionsSection.style.display = 'none';
        gameSectionBtn.classList.add('active');
        instructionsSectionBtn.classList.remove('active');
    });

    // Add event listener to the instructions section button
    instructionsSectionBtn.addEventListener('click', () => {
        gameSection.style.display = 'none';
        instructionsSection.style.display = 'block';
        gameSectionBtn.classList.remove('active');
        instructionsSectionBtn.classList.add('active');
    });

    // Initial display: game section active, instructions section hidden
    gameSection.style.display = 'block';
    instructionsSection.style.display = 'none';
    gameSectionBtn.classList.add('active');
    instructionsSectionBtn.classList.remove('active');
});




document.addEventListener('DOMContentLoaded', () => {
    let tries = 0;
    let history = []; // Initialize an empty history array

    // Function to clear the game state on page load
    function clearGameState() {
        tries = 0; // Reset tries
        history = []; // Reset history
        updateHistoryDisplay(history); // Clear the history display
    }

    // Function to update the history section on the page
    function updateHistoryDisplay(history) {
        const historyEntriesElement = document.querySelector('.history-entries');
        historyEntriesElement.innerHTML = ''; // Clear existing history entries

        history.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'history-entry';
            entryElement.textContent = `Guess: ${entry.guess}, Bulls: ${entry.bulls}, Cows: ${entry.cows}`;
            historyEntriesElement.insertBefore(entryElement, historyEntriesElement.firstChild);
        });
    }

    loadLeaderboard();
    fetchCurrentGameState();
    async function fetchCurrentGameState() {
        try {
            const response = await fetch('/api/current-game');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { currentTries, currentHistory } = await response.json();
            // Update the UI with the fetched tries and history
            tries = currentTries;
            history = currentHistory;
            updateHistoryDisplay(history);
        } catch (error) {
            console.error('Failed to fetch current game state:', error);
        }
    }
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

        tries++; // Increment tries on each guess

        try {
            const response = await fetch('/api/main', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guess })
            });
            const data = await response.json();

            if (data.error) {
                warningText.textContent = data.error;
            } else {
                document.getElementById('response').textContent = `Bulls: ${data.bulls}, Cows: ${data.cows}`;
                history.push({ guess: guess, ...data }); // Assume data contains bulls and cows
                updateHistoryDisplay(history); // Update the display with the new history entry

                if (data.isCorrect) {
                    showWinModal();
                    // Note: Do not reset tries here as it's needed for saving
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            warningText.textContent = 'There was a problem processing your guess. Please try again.';
        }

        guessInput.value = ''; // Clear input field after processing
    });

    function updateHistory(history) {
        const historyEntriesElement = document.querySelector('.history-entries');
        historyEntriesElement.innerHTML = ''; // Clear existing history entries

        history.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'history-entry';
            entryElement.textContent = `Guess: ${entry.guess}, Bulls: ${entry.bulls}, Cows: ${entry.cows}`;
            historyEntriesElement.appendChild(entryElement);
        });
    }

    function showWinModal() {
    
        const numTriesSpan = document.getElementById('numTries');
  
        numTriesSpan.textContent = tries; 
        const modal = document.getElementById('winModal');
        modal.style.display = 'block';
        
    }

    document.getElementById('saveScoreBtn').addEventListener('click', async () => {
        const nameInput = document.getElementById('playerName');
        const name = nameInput.value.trim();
        if (!name) {
            alert('Please enter your name.');
            return;
        }

        await saveScore(name, tries);
        loadLeaderboard();
        hideWinModal();
        // Reset the tries for the new game
        clearGameState();
    });

    document.getElementById('playAgainBtn').addEventListener('click', async () => {
        // Signal the server to start a new game
        try {
            const response = await fetch('/api/main', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startNewGame: true })
            });
            const data = await response.json();
            // Handle the response for a new game here
            // Update the UI accordingly
            hideWinModal();
            clearGameState();
        } catch (error) {
            console.error('Error starting a new game:', error);
        }
    });
    

    

    function hideWinModal() {
        const modal = document.getElementById('winModal');
        modal.style.display = 'none';
    }

    async function saveScore(name, tries) {
        try {
            const response = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, tries })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Failed to save score:', error);
        }
    }

    async function loadLeaderboard() {
        try {
            const response = await fetch('/api/leaderboard');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const leaderboardData = await response.json();
            displayLeaderboard(leaderboardData);
    
            // After leaderboard is loaded, clear the history
            updateHistory([]);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        }
    }
    

    function displayLeaderboard(leaderboardData) {
        const leaderboardElement = document.getElementById('leaderboard');
        leaderboardElement.innerHTML = '<h2>Leaderboard</h2>'; // Reset leaderboard title
    
        leaderboardData.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
    
            const nameSpan = document.createElement('span');
            nameSpan.className = 'name';
            nameSpan.textContent = entry.name;
    
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'score';
            scoreSpan.textContent = `${entry.tries} tries`;
    
            entryElement.appendChild(nameSpan);
            entryElement.appendChild(scoreSpan);
    
            leaderboardElement.appendChild(entryElement);
        });
    }
    


    // Initial load of the leaderboard
    loadLeaderboard();
    updateHistory([]);
    function clearGameState() {
        tries = 0; // Reset tries
        history = []; // Reset history
        updateHistoryDisplay(history); // Clear the history display
    }


});