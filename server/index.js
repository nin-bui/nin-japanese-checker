const express = require('express');
const cors = require('cors');
const { loadGrammar, checkGrammar } = require('./api/v1/grammar/grammarChecker');
const { analyzeFuzzyGrammar } = require('./api/v1/grammar/analyzeFuzzy');

const app = express();
app.use(cors());
app.use(express.json());

const grammarPatterns = loadGrammar();

app.post('/api/v1/grammar/check', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid text input.' });
  }

  const result = checkGrammar(text, grammarPatterns);

  // Nếu không khớp, dùng fuzzy
  if (result.matched.length === 0) {
    const fuzzy = await analyzeFuzzyGrammar(text, grammarPatterns);
    result.fuzzySuggestions = fuzzy.suggestions;
  }

  res.json(result);
});

app.get('/api/v1/grammar/by-level', (req, res) => {
  const grouped = {};
  for (const item of grammarPatterns) {
    const level = item.level || 'Unknown';
    if (!grouped[level]) grouped[level] = [];
    grouped[level].push({
      name: item.name,
      meaning: item.meaning,
      example: item.example,
      structure: item.structure
    });
  }
  res.json(grouped);
});

app.listen(3001, () => {
  console.log('Server is running at http://localhost:3001');
});
