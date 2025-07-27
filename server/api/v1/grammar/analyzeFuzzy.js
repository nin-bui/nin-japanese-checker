const levenshtein = require('js-levenshtein')
const kuromoji = require('kuromoji')
const grammarList = require('../grammar/grammar.json')

const tokenizerPromise = new Promise((resolve, reject) => {
  kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
    if (err) reject(err)
    else resolve(tokenizer)
  })
})

function normalizeByRules(text, rules = []) {
  let result = text
  for (const { pattern, replacement } of rules) {
    try {
      const regex = new RegExp(pattern, 'gu') // Unicode-aware
      result = result.replace(regex, replacement)
    } catch (e) {
      console.error('Invalid normalize pattern:', pattern, e)
    }
  }
  return result
}

async function analyzeFuzzyGrammar(inputText, fuzzyThreshold = 4) {
  const tokenizer = await tokenizerPromise
  const tokens = tokenizer.tokenize(inputText)
  const tokenizedText = tokens.map(token => token.surface_form).join('')

  const fuzzyMatches = []

  for (const pattern of grammarList) {
    const normalizeRules = pattern.normalize || []

    const normalizedInput = normalizeByRules(tokenizedText, normalizeRules)
    const normalizedStructure = normalizeByRules(pattern.structure, normalizeRules)

    const distance = levenshtein(normalizedInput, normalizedStructure)

    if (distance <= fuzzyThreshold) {
      fuzzyMatches.push({
        ...pattern,
        structure: normalizedStructure,
        distance,
        source: 'normalized fuzzy'
      })
    }
  }

  // Sắp xếp theo độ tương đồng tăng dần
  fuzzyMatches.sort((a, b) => a.distance - b.distance)

  return fuzzyMatches
}

module.exports = {
  analyzeFuzzyGrammar
}
