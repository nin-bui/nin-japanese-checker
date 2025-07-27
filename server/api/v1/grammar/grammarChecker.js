const fs = require('fs');
const path = require('path');

function loadGrammar() {
  const filePath = path.join(__dirname, 'grammar.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  return data.map(item => ({
    ...item,
    regex: new RegExp(item.pattern),
  }));
}

function checkGrammar(text, patterns) {
  const matched = [];
  const unmatched = [];

  for (const item of patterns) {
    if (item.regex.test(text)) {
      matched.push({ ...item });
    } else {
      unmatched.push({ ...item });
    }
  }

  return {
    input: text,
    matched,
    suggestion: matched.length === 0 ? 'Không phát hiện cấu trúc ngữ pháp đúng. Vui lòng kiểm tra lại câu.' : null
  };
}

module.exports = {
  loadGrammar,
  checkGrammar,
};
