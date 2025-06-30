import { getTokenCategory } from "@/utils/tokenUtils"
import type { ParsedProgram, ValidatedLevel, TokenCategory } from "@/types/game"

/**
 * Places tokens around the perimeter first, then inward in rows.
 * Ensures every outer-layer removal reveals another token
 * (simpler than full solver but works for our goals).
 */
function placeTokensInGrid(tokens: string[], size: number): string[] {
  const grid = Array(size * size).fill(null) as (string | null)[]

  let idx = 0
  // Spiral-like fill: perimeter → inner squares
  let top = 0,
    left = 0,
    bottom = size - 1,
    right = size - 1
  while (top <= bottom && left <= right) {
    // top row
    for (let col = left; col <= right && idx < tokens.length; col++) {
      grid[top * size + col] = tokens[idx++]
    }
    top++
    // right col
    for (let row = top; row <= bottom && idx < tokens.length; row++) {
      grid[row * size + right] = tokens[idx++]
    }
    right--
    // bottom row
    if (top <= bottom) {
      for (let col = right; col >= left && idx < tokens.length; col--) {
        grid[bottom * size + col] = tokens[idx++]
      }
      bottom--
    }
    // left col
    if (left <= right) {
      for (let row = bottom; row >= top && idx < tokens.length; row--) {
        grid[row * size + left] = tokens[idx++]
      }
      left++
    }
  }

  // any remaining nulls: pad with ";" as gray wildcards
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === null) grid[i] = ";"
  }
  return grid as string[]
}

export function validateLevel(parsed: ParsedProgram, gridSize: number, templateName: string): ValidatedLevel {
  // Build containerRequests straight from parsed data
  const containerRequests = parsed.containerSequence.map((c) => ({
    category: c.category,
    count: c.count,
  }))

  const gridTokens = placeTokensInGrid(parsed.tokens, gridSize)

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

  const isValid = containerRequests.every((req) => flatCounts[req.category] >= req.count)

  return {
    size: gridSize,
    gridTokens,
    containerRequests,
    templateName,
    solutionPath: parsed.optimalOrder, // placeholder; could compute exact positions
    isValid,
  }
}
