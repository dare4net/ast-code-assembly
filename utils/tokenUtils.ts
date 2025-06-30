import { TOKEN_CATEGORIES } from "@/constants/tokens"
import type { TokenCategory } from "@/types/game"

export function getTokenCategory(token: string): TokenCategory {
  for (const [category, data] of Object.entries(TOKEN_CATEGORIES)) {
    if (data.tokens.includes(token)) {
      return category as TokenCategory
    }
  }
  return "gray" // Default to wild if not found
}

export function validateCode(tokens: string[]): boolean {
  const code = tokens.join(" ")
  // Simple validation - check for basic structure
  const hasDeclaration = /\b(let|const|var)\b/.test(code)
  const hasControlStructure = /\b(if|while|for)\b/.test(code)
  const hasBraces = code.includes("{") && code.includes("}")

  return hasDeclaration && hasControlStructure && hasBraces
}
