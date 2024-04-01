// api/current-game.js

app.get('/api/current-game', (req, res) => {
  if (typeof req.session.tries === 'undefined') {
      req.session.tries = 0;
      req.session.history = [];
  }

  res.status(200).json({
      currentTries: req.session.tries,
      currentHistory: req.session.history
  });
});
