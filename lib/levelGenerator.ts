import { PROGRAM_DEFINITIONS } from "@/constants/templates"
import { parseProgram } from "./programParser"
import { validateLevel } from "./levelValidator"
import type { ValidatedLevel } from "@/types/game"

export function generateLevel(templateIndex?: number): ValidatedLevel {
  // Select program definition
  const programDef = templateIndex !== undefined 
    ? PROGRAM_DEFINITIONS[templateIndex]
    : PROGRAM_DEFINITIONS[Math.floor(Math.random() * PROGRAM_DEFINITIONS.length)]
  
  // Parse the program into tokens and container sequence
  const parsedProgram = parseProgram(programDef.program)
  
  // Calculate optimal grid size based on token count
  const tokenCount = parsedProgram.tokens.length
  const minGridSize = Math.ceil(Math.sqrt(tokenCount * 1.3)) // Add 30% padding
  const gridSize = Math.max(5, Math.min(8, minGridSize)) // Between 5x5 and 8x8
  
  // Generate and validate the level
  let level = validateLevel(parsedProgram, gridSize, programDef.name)
  
  // If validation fails, try with a larger grid
  if (!level.isValid && gridSize < 8) {
    level = validateLevel(parsedProgram, gridSize + 1, programDef.name)
  }
  
  // If still invalid, try with maximum grid size
  if (!level.isValid && gridSize < 8) {
    level = validateLevel(parsedProgram, 8, programDef.name)
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
