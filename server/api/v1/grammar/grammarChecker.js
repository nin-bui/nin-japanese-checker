const fs = require('fs');
const path = require('path');

// Đọc và chuẩn hóa ngữ pháp từ file JSON
function loadGrammar() {
  const grammarPath = path.join(__dirname, 'grammar.json');

  try {
    const rawData = fs.readFileSync(grammarPath, 'utf-8');
    const rawPatterns = JSON.parse(rawData);

    const patterns = rawPatterns.map(item => ({
      ...item,
      regex: new RegExp(item.pattern)
    }));

    console.log(`[grammarChecker] ✅ Loaded ${patterns.length} grammar patterns.`);
    return patterns;
  } catch (err) {
    console.error('❌ Failed to load grammar.json:', err);
    return [];
  }
}

// Kiểm tra văn bản đầu vào với toàn bộ cấu trúc ngữ pháp
function checkGrammar(text, patterns) {
  const matches = patterns.map(item => ({
    name: item.name,
    level: item.level,
    meaning: item.meaning,
    example: item.example,
    structure: item.structure,
    note: item.note,
    source: item.source,
    matched: item.regex.test(text)
  }));

  const matched = matches.filter(m => m.matched);

  return {
    input: text,
    matched: matched.map(m => ({ ...m, matched: undefined })),
    suggestion: matched.length === 0
      ? 'Không phát hiện cấu trúc ngữ pháp đúng. Vui lòng kiểm tra lại câu.'
      : null
  };
}

module.exports = {
  loadGrammar,
  checkGrammar
};
