const path = require("path")
const templatesPath = path.join(__dirname, "../constants/templates.js")
const tokensPath = path.join(__dirname, "../constants/tokens.js")
const { STRUCTURED_TEMPLATES } = require(templatesPath)
const { TOKEN_CATEGORIES } = require(tokensPath)

function getTokenCategory(token) {
  for (const [category, data] of Object.entries(TOKEN_CATEGORIES)) {
    if (data.tokens.includes(token)) {
      return category
    }
  }
  return "gray"
}

STRUCTURED_TEMPLATES.forEach((template) => {
  const categoryCounts = {}
  template.optimalSolution.forEach((token) => {
    const cat = getTokenCategory(token)
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const pattern = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }))
  console.log(`Template: ${template.name}`)
  console.log("pattern:", pattern)
})
