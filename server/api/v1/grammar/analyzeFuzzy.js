const kuromoji = require('kuromoji');
const path = require('path');
const builder = kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' });

let tokenizerInstance = null;

// Load tokenizer 1 lần
builder.build((err, tokenizer) => {
  if (err) throw err;
  tokenizerInstance = tokenizer;
});

async function analyzeFuzzyGrammar(text, grammarPatterns) {
  if (!tokenizerInstance) throw new Error('Tokenizer chưa sẵn sàng');

  const tokens = tokenizerInstance.tokenize(text);
  const surfaceText = tokens.map(t => t.surface_form).join('');

  const suggestions = [];

  for (const pattern of grammarPatterns) {
    const regex = new RegExp(pattern.pattern);
    const distance = levenshteinDistance(surfaceText, pattern.example.replace(/[^\u3040-\u30FF\u4E00-\u9FAF]/g, ''));

    if (!regex.test(text) && distance <= 2) {
      suggestions.push({
        name: pattern.name,
        level: pattern.level,
        example: pattern.example,
        fixHint: `Câu của bạn có thể gần đúng với: ${pattern.example}`
      });
    }
  }

  return {
    input: text,
    suggestions: suggestions.slice(0, 3)
  };
}

// Hàm tính khoảng cách Levenshtein
function levenshteinDistance(a, b) {
  const matrix = Array(a.length + 1).fill(null).map(() =>
    Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

module.exports = { analyzeFuzzyGrammar };
