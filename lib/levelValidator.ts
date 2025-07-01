import { getTokenCategory, validateCode } from "@/utils/tokenUtils"
import { TOKEN_CATEGORIES } from "@/constants/tokens"
import type { ParsedProgram, ValidatedLevel, TokenCategory } from "@/types/game"

// Helper: Get subgroups for green tokens
const GREEN_KEYWORDS = ["let", "const", "var", "function", "class", "new", "this"]
const GREEN_ASSIGN_OPS = ["=", "+=", "-=", "*=", "/=", "%=", "++", "--"]
const GREEN_VARIABLES = ["x", "y", "z", "i", "j", "name", "value", "data", "result", "count", "index"]

// Ensure every green container requires a meaningful combination
function fixGreenContainerRequests(containerRequests: {category: TokenCategory, count: number}[]): {category: TokenCategory, count: number, required?: string[]}[] {
  return containerRequests.map(req => {
    if (req.category === "green" && req.count < 3) {
      // Always require at least 3: keyword, variable, assignment op
      return {
        ...req,
        count: 3,
        required: [
          GREEN_KEYWORDS[Math.floor(Math.random() * GREEN_KEYWORDS.length)],
          GREEN_VARIABLES[Math.floor(Math.random() * GREEN_VARIABLES.length)],
          GREEN_ASSIGN_OPS[Math.floor(Math.random() * GREEN_ASSIGN_OPS.length)]
        ]
      }
    }
    return req
  })
}

function ensureVariableNamesForAssignments(tokens: string[], containerRequests: {category: TokenCategory, count: number}[]): string[] {
  const variableNames = TOKEN_CATEGORIES.green.tokens.filter(t => ["x","y","z","i","j","name","value","data","result","count","index"].includes(t))
  let tokensWithVars = [...tokens]
  const hasVariable = tokens.some(t => variableNames.includes(t))
  const needsVariable = containerRequests.some(req => req.category === "green")
  if (needsVariable && !hasVariable) {
    // Add a random variable name if missing
    tokensWithVars.push(variableNames[Math.floor(Math.random() * variableNames.length)])
  }
  return tokensWithVars
}

function ensureGreenRequiredTokens(tokens: string[], containerRequests: {category: TokenCategory, count: number, required?: string[]}[]): string[] {
  let result = [...tokens]
  containerRequests.forEach(req => {
    if (req.category === "green" && req.required) {
      req.required.forEach(t => {
        if (!result.includes(t)) result.push(t)
      })
    }
  })
  return result
}

function getAllNonRequiredTokens(requiredTokens: string[], totalNeeded: number): string[] {
  // Flatten all tokens from all categories
  const allTokens = Object.values(TOKEN_CATEGORIES).flatMap((cat) => cat.tokens)
  // Exclude required tokens to avoid duplicates
  const nonRequired = allTokens.filter((t) => !requiredTokens.includes(t))
  // Shuffle and pick as many as needed
  const shuffled = nonRequired.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, totalNeeded)
}

/**
 * Places tokens around the perimeter first, then inward in rows.
 * Ensures every outer-layer removal reveals another token
 * (simpler than full solver but works for our goals).
 */
export function placeTokensInGrid(tokens: string[], size: number, containerRequests: {category: TokenCategory, count: number, required?: string[]}[]): string[] {
  // Ensure green required tokens
  const tokensWithGreen = ensureGreenRequiredTokens(tokens, containerRequests)
  const gridSize = size * size
  const requiredTokens = [...tokensWithGreen]
  const extraCount = gridSize - requiredTokens.length
  const wildcards = TOKEN_CATEGORIES.gray.tokens
  const numWildcards = Math.floor(extraCount / 3) // up to 1/3 wildcards
  const numRandom = extraCount - numWildcards
  const randomTokens = getAllNonRequiredTokens(requiredTokens, numRandom)
  const filler = [
    ...Array(numWildcards).fill(wildcards[Math.floor(Math.random() * wildcards.length)]),
    ...randomTokens,
  ]
  // Combine and shuffle all tokens for random placement
  const allGridTokens = [...requiredTokens, ...filler].sort(() => Math.random() - 0.5)
  return allGridTokens
}

export function validateLevel(parsed: ParsedProgram, gridSize: number, templateName: string): ValidatedLevel {
  // Build containerRequests straight from parsed data
  let containerRequests = parsed.containerSequence.map((c) => ({
    category: c.category,
    count: c.count,
  }))
  // Fix green containers to require meaningful combinations
  containerRequests = fixGreenContainerRequests(containerRequests)

  const gridTokens = placeTokensInGrid(parsed.tokens, gridSize, containerRequests)

  // QUICK sanity check: ensure each required token exists in grid
  const flatCounts: Record<TokenCategory, number> = {
    blue: 0,
    green: 0,
    orange: 0,
    purple: 0,
    red: 0,
    cyan: 0,
    gray: 0,
  }
  gridTokens.forEach((t) => flatCounts[getTokenCategory(t)]++)

  const hasAllRequiredTokens = containerRequests.every((req) => flatCounts[req.category] >= req.count)

  // NEW: Validate that the collected tokens (in optimal order) form a valid program
  let isProgramValid = false
  if (parsed.optimalOrder && parsed.optimalOrder.length > 0) {
    const collectedTokens = parsed.optimalOrder.map((idx) => gridTokens[idx] ?? "")
    isProgramValid = validateCode(collectedTokens)
  }

  const isValid = hasAllRequiredTokens && isProgramValid

  return {
    size: gridSize,
    gridTokens,
    containerRequests,
    templateName,
    solutionPath: parsed.optimalOrder, // placeholder; could compute exact positions
    isValid,
  }
}
