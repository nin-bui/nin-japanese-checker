const express = require('express');
const cors = require('cors');
const { loadGrammar, checkGrammar } = require('./api/v1/grammar/grammarChecker');

const app = express();
app.use(cors());
app.use(express.json());

// Load patterns khi server khởi động
const grammarPatterns = loadGrammar();

// API kiểm tra ngữ pháp
app.post('/api/v1/grammar/check', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid text input.' });
  }

  const result = checkGrammar(text, grammarPatterns);
  res.json(result);
});

// API trả về danh sách ngữ pháp theo cấp độ
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

// Start server
app.listen(3001, () => {
  console.log('Server is running at http://localhost:3001');
});
