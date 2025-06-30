export type GameState = "playing" | "complete" | "game-over"
export type TokenCategory = "blue" | "green" | "orange" | "purple" | "red" | "cyan" | "gray"

export interface Container {
  category: TokenCategory
  count: number
  collected: string[]
}

export interface BufferSlot {
  token: string | null
  category: TokenCategory | null
}

export interface ProgramTemplate {
  name: string
  description: string
  pattern: {
    category: TokenCategory
    count: number
    description: string
  }[]
  tokenPools: {
    [key in TokenCategory]?: string[]
  }
  minGridSize: number
}

export interface GeneratedLevel {
  size: number
  gridTokens: (string | null)[]
  containerRequests: { category: TokenCategory; count: number }[]
  templateName: string
}

export interface TokenCategoryData {
  name: string
  tokens: string[]
  color: string
}

export interface ProgramDefinition {
  name: string
  description: string
  program: string
  difficulty: number
}

export interface ParsedProgram {
  tokens: string[]
  containerSequence: {
    category: TokenCategory
    count: number
    tokens: string[]
    description: string
  }[]
  optimalOrder: number[] // Indices of tokens in optimal collection order
}

export interface ValidatedLevel {
  size: number
  gridTokens: (string | null)[]
  containerRequests: { category: TokenCategory; count: number }[]
  templateName: string
  solutionPath: number[] // Positions in grid that lead to solution
  isValid: boolean
}
