import { STRUCTURED_TEMPLATES } from "../constants/templates"
import { getTokenCategory } from "../utils/tokenUtils"

// This script will print the correct pattern for each template based on its optimalSolution
STRUCTURED_TEMPLATES.forEach((template) => {
  const categoryCounts: Record<string, number> = {}
  template.optimalSolution.forEach((token) => {
    const cat = getTokenCategory(token)
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const pattern = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }))
  console.log(`Template: ${template.name}`)
  console.log("pattern:", pattern)
})
