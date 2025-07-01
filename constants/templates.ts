import type { ProgramTemplate, TokenCategory } from "@/types/game"
import { getTokenCategory } from "@/utils/tokenUtils"

// New structured template type
interface StructuredTemplate {
  name: string
  description: string
  example: string // Example code for reference
  difficulty: number
  optimalSolution: string[] // List of token values (not just categories) that must be present in the grid
  size?: number // Optional grid size (for 7x7 enforcement)
}

export const STRUCTURED_TEMPLATES: StructuredTemplate[] = [
  {
    name: "If Statement with Declaration",
    description: "let x = 3; if (x < 5) { return x; }",
    example: `let x = 3;\nif (x < 5) {\n  return x;\n}`,
    difficulty: 2,
    optimalSolution: [
      "let", "x", "=", "3", ";", "if", "(", "x", "<", "5", ")", "{", "return", "x", ";", "}", ";"
    ],
    size: 7,
  },
  {
    name: "For Loop with Assignment",
    description: "for (let i = 0; i < 10; i++) { sum += i; }",
    example: `for (let i = 0; i < 10; i++) {\n  sum += i;\n}`,
    difficulty: 3,
    optimalSolution: [
      "for", "(", "let", "i", "=", "0", ";", "i", "<", "10", ";", "i", "++", ")", "{", "sum", "+=", "i", ";", "}", ";"
    ],
    size: 7,
  },
  {
    name: "Function with Parameters and Return",
    description: "function add(a, b) { return a + b; }",
    example: `function add(a, b) {\n  return a + b;\n}`,
    difficulty: 3,
    optimalSolution: [
      "function", "add", "(", "a", ",", "b", ")", "{", "return", "a", "+", "b", ";", "}", ";"
    ],
    size: 7,
  },
  {
    name: "Array Manipulation and Loop",
    description: "let arr = [1,2,3]; for (let i = 0; i < arr.length; i++) { arr[i] *= 2; }",
    example: `let arr = [1,2,3];\nfor (let i = 0; i < arr.length; i++) {\n  arr[i] *= 2;\n}`,
    difficulty: 4,
    optimalSolution: [
      "let", "arr", "=", "[", "1", ",", "2", ",", "3", "]", ";", "for", "(", "let", "i", "=", "0", ";", "i", "<", "arr", ".", "length", ";", "i", "++", ")", "{", "arr", "[", "i", "]", "*=" , "2", ";", "}", ";"
    ],
    size: 7,
  },
  {
    name: "Nested If-Else with Assignment",
    description: "let x = 10; if (x > 5) { x = x - 1; } else { x = x + 1; }",
    example: `let x = 10;\nif (x > 5) { x = x - 1; } else { x = x + 1; }` ,
    difficulty: 4,
    optimalSolution: [
      "let", "x", "=", "10", ";", "if", "(", "x", ">", "5", ")", "{", "x", "=", "x", "-", "1", ";", "}", "else", "{", "x", "=", "x", "+", "1", ";", "}", ";"
    ],
    size: 7,
  },
  {
    name: "Switch Statement with Cases",
    description: "switch (val) { case 1: x = 1; break; case 2: x = 2; break; default: x = 0; }",
    example: `switch (val) { case 1: x = 1; break; case 2: x = 2; break; default: x = 0; }`,
    difficulty: 4,
    optimalSolution: [
      "switch", "(", "val", ")", "{", "case", "1", ":", "x", "=", "1", ";", "break", ";", "case", "2", ":", "x", "=", "2", ";", "break", ";", "default", ":", "x", "=", "0", ";", "}", ";"
    ],
    size: 7,
  },
  {
    name: "Ternary and Logical Combination",
    description: "let result = (a > b) ? a : b && c;",
    example: `let result = (a > b) ? a : b && c;`,
    difficulty: 4,
    optimalSolution: [
      "let", "result", "=", "(", "a", ">", "b", ")", "?", "a", ":", "b", "&&", "c", ";"
    ],
    size: 7,
  },
]

/**
 * Given a code string, returns a pattern array for the template.
 * Groups consecutive tokens of the same category and counts them.
 * Use this utility in game logic, not in the template definition.
 */
export function generatePatternFromTokens(tokens: string[]): { category: TokenCategory; count: number }[] {
  const pattern: { category: TokenCategory; count: number }[] = []
  let lastCategory: TokenCategory | null = null
  let count = 0
  for (const token of tokens) {
    let category = getTokenCategory(token)
    // Treat 'gray' (wild) as belonging to the previous non-gray category for pattern grouping
    if (category === "gray" && lastCategory && lastCategory !== "gray") {
      // Add wildcards to the previous category's count
      count++
      continue
    }
    if (category === lastCategory) {
      count++
    } else {
      if (lastCategory !== null && lastCategory !== "gray") {
        pattern.push({ category: lastCategory, count })
      }
      lastCategory = category
      count = 1
    }
  }
  if (lastCategory !== null && lastCategory !== "gray") {
    pattern.push({ category: lastCategory, count })
  }
  return pattern
}

// Complete program definitions that will be parsed into tokens
export const PROGRAM_DEFINITIONS = [
  {
    name: "Basic Conditional",
    description: "Variable declaration with if-else logic",
    program: `let x = 5;
if (x > 0) {
  console.log("positive");
} else {
  console.log("negative");
}`,
    difficulty: 1,
  },
  {
    name: "Simple Loop",
    description: "For loop with counter and operations",
    program: `for (let i = 0; i < 10; i++) {
  console.log(i);
}`,
    difficulty: 1,
  },
  {
    name: "Function Logic",
    description: "Function with conditional return logic",
    program: `function calculate(num) {
  if (num > 5) {
    return num + 1;
  } else {
    return 0;
  }
}`,
    difficulty: 2,
  },
  {
    name: "Array Operations",
    description: "Array creation and manipulation",
    program: `let arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
    difficulty: 2,
  },
  {
    name: "Complex Logic",
    description: "Nested conditions with multiple operations",
    program: `let count = 0;
for (let i = 1; i <= 100; i++) {
  if (i % 2 === 0) {
    count += i;
  }
}
console.log(count);`,
    difficulty: 3,
  },
  // --- New templates that require wildcards ---
  {
    name: "Ternary Assignment",
    description: "Assignment using the ternary operator (requires ? and :)",
    program: `let status = (score > 50) ? "pass" : "fail";`,
    difficulty: 2,
  },
  {
    name: "Comma Operator",
    description: "Multiple assignments in one statement (requires ,)",
    program: `let a = 1, b = 2, c = 3;`,
    difficulty: 2,
  },
  {
    name: "Chained Calls",
    description: "Chained method calls (requires .)",
    program: `let result = arr.map(x => x * 2).filter(x => x > 5).join(",");`,
    difficulty: 3,
  },
  {
    name: "String Template",
    description: "Template literal usage (requires \`)",
    program: "let msg = `Hello, ${name}!`;",
    difficulty: 2,
  },
  {
    name: "Multiple Statements",
    description: "Multiple statements separated by semicolons (requires ;)",
    program: `let x = 1; let y = 2; let z = x + y;`,
    difficulty: 1,
  },
]

// Legacy export for backward compatibility - will be replaced by program parser
export const PROGRAM_TEMPLATES: ProgramTemplate[] = []
