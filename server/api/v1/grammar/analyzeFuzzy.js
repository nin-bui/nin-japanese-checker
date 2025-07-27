
const kuromoji = require('kuromoji');
const path = require('path');
const stringSimilarity = require('string-similarity');
const fs = require('fs');

// Load grammar patterns
const grammarPath = path.join(__dirname, 'grammar.json');
const rawData = fs.readFileSync(grammarPath, 'utf-8');
const grammarPatterns = JSON.parse(rawData);

const tokenizeText = (text) => {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) return reject(err);
      const tokens = tokenizer.tokenize(text);
      resolve(tokens.map(t => t.surface_form));
    });
  });
};

const analyzeFuzzyGrammar = async (text) => {
  const words = await tokenizeText(text);
  const joinedText = words.join('');

  const suggestions = grammarPatterns
    .map(rule => {
      const example = rule.example.replace(/[\s。、「」]/g, '');
      const score = stringSimilarity.compareTwoStrings(joinedText, example);
      return { rule, score };
    })
    .filter(result => result.score >= 0.6)
    .sort((a, b) => b.score - a.score);

  return {
    input: text,
    tokens: words,
    suggestions: suggestions.map(s => ({
      name: s.rule.name,
      meaning: s.rule.meaning,
      example: s.rule.example,
      matched_score: s.score.toFixed(2),
      suggestion: 'Câu của bạn có thể gần với mẫu này.'
    }))
  };
};

module.exports = { analyzeFuzzyGrammar };
