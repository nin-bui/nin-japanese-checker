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

function normalizeText(text, normalizeRules = []) {
    let result = text;
    for (const { pattern, replacement } of normalizeRules) {
      try {
        const regex = new RegExp(pattern, 'gu');
        result = result.replace(regex, replacement);
      } catch (e) {
        console.error('Invalid normalize pattern:', pattern, e);
      }
    }
    console.log("result", result);
    
    return result;
  }
  
  function checkGrammar(inputText, patterns) {
    const matched = [];
    const unmatched = [];
  
    for (const item of patterns) {
      const normalizedText = normalizeText(inputText, item.normalize || []);
      
      if (item.regex && item.regex.test(normalizedText)) {
        console.log("normalizedText", normalizedText);
        
        matched.push({ ...item });
      } else {
        unmatched.push({ ...item });
      }
    }
  
    return {
      input: inputText,
      matched,
      suggestion: matched.length === 0
        ? 'Không phát hiện cấu trúc ngữ pháp đúng. Vui lòng kiểm tra lại câu.'
        : null
    };
  }
  

module.exports = {
  loadGrammar,
  checkGrammar,
};
