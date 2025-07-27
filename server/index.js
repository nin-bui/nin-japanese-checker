const express = require('express');
const cors = require('cors');
const { loadGrammar, checkGrammar } = require('./api/v1/grammar/grammarChecker');
const { analyzeFuzzyGrammar } = require('./api/v1/grammar/analyzeFuzzy');

const app = express();
app.use(cors());
app.use(express.json());

// Load patterns khi server khởi động
const grammarPatterns = loadGrammar();

// ✅ API kiểm tra ngữ pháp, TÍCH HỢP fuzzy
app.post('/api/v1/grammar/check', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid text input.' });
  }

  const result = checkGrammar(text, grammarPatterns);

  if (result.matched.length === 0) {
    try {
      const fuzzyResult = await analyzeFuzzyGrammar(text);
      result.suggestion = 'Không phát hiện ngữ pháp chính xác. Đề xuất gần đúng:';
      result.fuzzy = fuzzyResult.suggestions;
    } catch (err) {
      console.error('Fuzzy check failed:', err);
      result.suggestion = 'Không phát hiện ngữ pháp chính xác và không thể phân tích gần đúng.';
      result.fuzzy = [];
    }
  }

  res.json(result);
});

// (Giữ lại để test độc lập nếu cần)
app.post('/fuzzy-check', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await analyzeFuzzyGrammar(text);
    res.json(result);
  } catch (err) {
    console.error('Fuzzy check failed:', err);
    res.status(500).json({ error: 'Failed to analyze text.' });
  }
});

// ✅ Khởi động server
app.listen(3001, () => {
  console.log('Server is running at http://localhost:3001');
});
