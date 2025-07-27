const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Load grammar patterns from JSON file
let grammarPatterns = [];

try {
  const rawData = fs.readFileSync('./grammar.json', 'utf-8');
  const rawPatterns = JSON.parse(rawData);

  // Convert pattern string → RegExp
  grammarPatterns = rawPatterns.map(item => ({
    ...item,
    regex: new RegExp(item.pattern)
  }));

  console.log(`Loaded ${grammarPatterns.length} grammar patterns.`);
} catch (err) {
  console.error('Failed to load grammar patterns:', err);
}

// API endpoint
app.post('/check', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided.' });
  }

  console.log(`Received text: ${text}`);

  const matches = grammarPatterns.filter(item => item.regex.test(text));

  res.json({ results: matches });
});

// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
