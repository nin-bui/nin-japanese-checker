const fs = require('fs');

// Load và chuẩn hóa dữ liệu từ grammar.json
const loadGrammar = () => {
  const rawData = fs.readFileSync('./grammar.json', 'utf-8');
  const patterns = JSON.parse(rawData);
  return patterns.map(item => ({
    ...item,
    regex: new RegExp(item.pattern)
  }));
};

// Hàm phân tích 1 câu
const checkGrammar = (text, patterns) => {
  const results = patterns.map(item => ({
    ...item,
    matched: item.regex.test(text)
  }));

  const matched = results.filter(r => r.matched);
  return {
    input: text,
    matched: matched.map(({ matched, ...rest }) => rest),
    suggestion: matched.length === 0 ? 'Không phát hiện cấu trúc ngữ pháp đúng. Vui lòng kiểm tra lại câu.' : null
  };
};

module.exports = { loadGrammar, checkGrammar };
