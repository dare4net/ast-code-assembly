import { TOKEN_CATEGORIES } from "@/constants/tokens"
import type { TokenCategory } from "@/types/game"
import * as acorn from "acorn"

console.log('[validateCode] acorn import:', acorn)

export function getTokenCategory(token: string): TokenCategory {
  for (const [category, data] of Object.entries(TOKEN_CATEGORIES)) {
    if (data.tokens.includes(token)) {
      return category as TokenCategory
    }
  }
  return "gray" // Default to wild if not found
}

export function validateCode(tokens: string[]): { valid: boolean; error?: string } {
  console.log('[validateCode] called')
  // Smarter join: no space before/after certain tokens
  let code = ""
  const noSpaceBefore = new Set([";", ",", ")", "]", "}"])
  const noSpaceAfter = new Set(["(", "[", "{"])
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (i > 0) {
      if (!noSpaceBefore.has(t) && !noSpaceAfter.has(tokens[i - 1])) {
        code += " "
      }
    }
    code += t
  }
  // Debug: log the code string being parsed
  if (typeof window !== 'undefined') {
    console.log('[validateCode] code to parse:', code)
  }
  try {
    acorn.parse(code, { ecmaVersion: 2020 })
    return { valid: true }
  } catch (e: any) {
    if (typeof window !== 'undefined') {
      console.error('[validateCode] acorn error:', e.message)
    }
    return { valid: false, error: e.message }
  }
}
