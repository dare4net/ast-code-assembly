import { getTokenCategory } from "@/utils/tokenUtils"
import type { ParsedProgram, TokenCategory } from "@/types/game"

/**
 * VERY simple tokenizer:
 * 1. splits on whitespace
 * 2. strips trailing punctuation (, ; ( ) { } etc.) into separate tokens
 *
 * NOTE: this is not a real JS parser—it’s “good enough” for our pre-defined
 * examples.  Feel free to swap in a real tokenizer later.
 */
function naiveTokenize(code: string): string[] {
  const rough = code
    .replace(/([[\]$$$${};,])/g, " $1 ")
    .split(/\s+/)
    .filter(Boolean)
  return rough
}

/**
 * Arrange containers in a fixed semantic order so game flow feels natural:
 * 1. green  → declarations
 * 2. blue   → control structures / braces / parens
 * 3. purple → operators & logic
 * 4. red    → literals
 * 5. cyan   → built-ins  (console.log etc.)
 * 6. orange → jump / flow (return, break)
 * 7. gray   → wild / punctuation
 */
const ORDER: TokenCategory[] = ["green", "blue", "purple", "red", "cyan", "orange", "gray"]

export function parseProgram(code: string): ParsedProgram {
  const tokens: string[] = naiveTokenize(code)

  // Count tokens per category
  const grouped: Record<TokenCategory, string[]> = {
    blue: [],
    green: [],
    orange: [],
    purple: [],
    red: [],
    cyan: [],
    gray: [],
  }

  tokens.forEach((tok) => {
    const cat = getTokenCategory(tok)
    grouped[cat].push(tok)
  })

  const containerSequence = ORDER.filter((cat) => grouped[cat].length > 0).map((cat) => ({
    category: cat,
    count: grouped[cat].length,
    tokens: grouped[cat],
    description: `${cat} tokens`,
  }))

  // Optimal collection order here is simply source order
  const optimalOrder = tokens.map((_, idx) => idx)

  return {
    tokens,
    containerSequence,
    optimalOrder,
  }
}
