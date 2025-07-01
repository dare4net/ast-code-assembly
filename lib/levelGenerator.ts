import { PROGRAM_DEFINITIONS, STRUCTURED_TEMPLATES } from "@/constants/templates"
import { parseProgram } from "./programParser"
import { placeTokensInGrid, validateLevel } from "@/lib/levelValidator"
import type { ValidatedLevel } from "@/types/game"

export function generateLevel(templateIndex?: number) {
  // Always use structured templates
  return generateLevelBase(templateIndex, true)
}

function enforceSemicolonAndNewline(tokens: string[]): string[] {
  // Insert a semicolon and a newline after every statement-ending token (e.g., '}', or literals, or assignment)
  // For simplicity, treat '}', literals, and assignment ops as statement ends
  const statementEnders = [
    "}", ";", "=", "+=", "-=", "*=", "/=", "%=", "++", "--",
    ...["0","1","2","3","4","5","6","7","8","9","true","false","null","undefined","NaN","Infinity","\"hello\"","\"world\"","'text'", "`template`"]
  ]
  const result: string[] = []
  for (let i = 0; i < tokens.length; i++) {
    result.push(tokens[i])
    if (statementEnders.includes(tokens[i])) {
      result.push(";")
      result.push("\n")
    }
  }
  return result
}

function generateLevelBase(templateIndex?: number, useStructured = false) {
  if (useStructured) {
    // Use structured template logic
    const template = templateIndex !== undefined
      ? STRUCTURED_TEMPLATES[templateIndex]
      : STRUCTURED_TEMPLATES[Math.floor(Math.random() * STRUCTURED_TEMPLATES.length)]

    // Build container requests from pattern (now generated dynamically)
    // Generate pattern from optimalSolution
    const { generatePatternFromTokens } = require("@/constants/templates")
    const pattern = generatePatternFromTokens(template.optimalSolution)
    const containerRequests = pattern.map((p: any) => ({
      category: p.category,
      count: p.count,
    }))

    // Only use tokens from the optimalSolution array, filter out "\n"
    let optimalTokens: string[] = template.optimalSolution.filter(t => t !== "\n")
    // Calculate grid size: minimum square that fits all tokens, max 10
    const gridSize = Math.max(5, Math.min(10, Math.ceil(Math.sqrt(optimalTokens.length))))
    const totalSlots = gridSize * gridSize
    // Create an array of empty slots
    const { TOKEN_CATEGORIES } = require("@/constants/tokens")
    const emptyToken = TOKEN_CATEGORIES.empty.tokens[0]
    let gridTokens: (string)[] = Array(totalSlots).fill(emptyToken)
    // Randomly pick slots to place optimal tokens
    let availableIndices = Array.from({length: totalSlots}, (_, i) => i)
    // Shuffle available indices
    availableIndices = availableIndices.sort(() => Math.random() - 0.5)
    // Place each optimal token in a random slot
    for (let i = 0; i < optimalTokens.length; i++) {
      gridTokens[availableIndices[i]] = optimalTokens[i]
    }
    // Return a level-like object
    return {
      size: gridSize,
      gridTokens,
      containerRequests,
      templateName: template.name,
      solutionPath: [],
      isValid: true,
    }
  }

  // Select program definition
  const programDef = templateIndex !== undefined 
    ? PROGRAM_DEFINITIONS[templateIndex]
    : PROGRAM_DEFINITIONS[Math.floor(Math.random() * PROGRAM_DEFINITIONS.length)]
  
  // Parse the program into tokens and container sequence
  const parsedProgram = parseProgram(programDef.program)
  
  // Calculate optimal grid size based on token count
  const tokenCount = parsedProgram.tokens.length
  const minGridSize = Math.ceil(Math.sqrt(tokenCount * 1.3)) // Add 30% padding
  // Clamp grid size between 5x5 and 10x10
  const gridSize = Math.max(5, Math.min(10, minGridSize))
  
  // Generate and validate the level
  let level = validateLevel(parsedProgram, gridSize, programDef.name)
  
  // If validation fails, try with a larger grid up to 10x10
  for (let trySize = gridSize + 1; !level.isValid && trySize <= 10; trySize++) {
    level = validateLevel(parsedProgram, trySize, programDef.name)
  }

  // Log validation result for debugging
  console.log(`Level "${programDef.name}" validation:`, level.isValid ? 'VALID' : 'INVALID')
  if (level.isValid) {
    console.log(`Program: ${programDef.program.replace(/\n/g, ' ')}`)
    console.log(`Tokens: ${parsedProgram.tokens.join(' ')}`)
  }
  
  return level
}

// Get available program templates for UI
export function getAvailableTemplates() {
  return PROGRAM_DEFINITIONS.map((def, index) => ({
    index,
    name: def.name,
    description: def.description,
    difficulty: def.difficulty
  }))
}
