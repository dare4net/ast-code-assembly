import type { TokenCategory } from "@/types/game"
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
      "let", "x", "=", "3", ";", "if", "(", "x", "<", "5", ")", "{", "return", "x", ";", "}"
    ],
    size: 7,
  },
  {
    name: "For Loop with Assignment",
    description: "for (let i = 0; i < 10; i++) { sum += i; }",
    example: `for (let i = 0; i < 10; i++) {\n  sum += i;\n}`,
    difficulty: 3,
    optimalSolution: [
      "for", "(", "let", "i", "=", "0", ";", "i", "<", "10", ";", "i", "++", ")", "{", "sum", "+=", "i", ";", "}"
    ],
    size: 7,
  },
  {
    name: "Function with Parameters and Return",
    description: "function add(a, b) { return a + b; }",
    example: `function add(a, b) {\n  return a + b;\n}`,
    difficulty: 3,
    optimalSolution: [
      "function", "add", "(", "a", ",", "b", ")", "{", "return", "a", "+", "b", ";", "}"
    ],
    size: 7,
  },
  {
    name: "Array Manipulation and Loop",
    description: "let arr = [1,2,3]; for (let i = 0; i < arr.length; i++) { arr[i] *= 2; }",
    example: `let arr = [1,2,3];\nfor (let i = 0; i < arr.length; i++) {\n  arr[i] *= 2;\n}`,
    difficulty: 4,
    optimalSolution: [
      "let", "arr", "=", "[", "1", ",", "2", ",", "3", "]", ";", "for", "(", "let", "i", "=", "0", ";", "i", "<", "arr", ".", "length", ";", "i", "++", ")", "{", "arr", "[", "i", "]", "*=" , "2", ";", "}"
    ],
    size: 7,
  },
  {
    name: "Nested If-Else with Assignment",
    description: "let x = 10; if (x > 5) { x = x - 1; } else { x = x + 1; }",
    example: `let x = 10;\nif (x > 5) { x = x - 1; } else { x = x + 1; }` ,
    difficulty: 4,
    optimalSolution: [
      "let", "x", "=", "10", ";", "if", "(", "x", ">", "5", ")", "{", "x", "=", "x", "-", "1", ";", "}", "else", "{", "x", "=", "x", "+", "1", ";", "}"
    ],
    size: 7,
  },
  {
    name: "Switch Statement with Cases",
    description: "switch (val) { case 1: x = 1; break; case 2: x = 2; break; default: x = 0; }",
    example: `switch (val) { case 1: x = 1; break; case 2: x = 2; break; default: x = 0; }`,
    difficulty: 4,
    optimalSolution: [
      "switch", "(", "val", ")", "{", "case", "1", ":", "x", "=", "1", ";", "break", ";", "case", "2", ":", "x", "=", "2", ";", "break", ";", "default", ":", "x", "=", "0", ";", "}"
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
  {
    name: "While Loop with Counter",
    description: "let i = 0; while (i < 5) { i++; }",
    example: `let i = 0;\nwhile (i < 5) {\n  i++;\n}`,
    difficulty: 3,
    optimalSolution: [
      "let", "i", "=", "0", ";", "while", "(", "i", "<", "5", ")", "{", "i", "++", ";", "}"
    ],
    size: 7,
  },
  {
    name: "Function with Conditional Return",
    description: "function check(x) { if (x > 0) { return true; } else { return false; } }",
    example: `function check(x) {\n  if (x > 0) {\n    return true;\n  } else {\n    return false;\n  }\n}`,
    difficulty: 4,
    optimalSolution: [
      "function", "check", "(", "x", ")", "{", "if", "(", "x", ">", "0", ")", "{", "return", "true", ";", "}", "else", "{", "return", "false", ";", "}", "}"
    ],
    size: 7,
  },
  {
    name: "Array Push and Log",
    description: "let arr = []; arr.push(1); console.log(arr);",
    example: `let arr = [];\narr.push(1);\nconsole.log(arr);`,
    difficulty: 2,
    optimalSolution: [
      "let", "arr", "=", "[", "]", ";", "arr", ".", "push", "(", "1", ")", ";", "console.log", "(", "arr", ")", ";"
    ],
    size: 7,
  },
  {
    name: "For-Of Loop with Sum",
    description: "let sum = 0; for (let n of nums) { sum += n; }",
    example: `let sum = 0;\nfor (let n of nums) {\n  sum += n;\n}`,
    difficulty: 4,
    optimalSolution: [
      "let", "sum", "=", "0", ";", "for", "(", "let", "n", "of", "nums", ")", "{", "sum", "+=", "n", ";", "}"
    ],
    size: 7,
  },
  {
    name: "Switch with Default",
    description: "switch (x) { case 1: break; default: break; }",
    example: `switch (x) {\n  case 1: break;\n  default: break;\n}`,
    difficulty: 3,
    optimalSolution: [
      "switch", "(", "x", ")", "{", "case", "1", ":", "break", ";", "default", ":", "break", ";", "}"
    ],
    size: 7,
  },
  // --- Converted PROGRAM_DEFINITIONS below ---
  {
    name: "Basic Conditional",
    description: "let x = 5; if (x > 0) { console.log(\"positive\"); } else { console.log(\"negative\"); }",
    example: `let x = 5;\nif (x > 0) {\n  console.log(\"positive\");\n} else {\n  console.log(\"negative\");\n}`,
    difficulty: 1,
    optimalSolution: [
      "let", "x", "=", "5", ";", "if", "(", "x", ">", "0", ")", "{", "console.log", "(", '"positive"', ")", ";", "}", "else", "{", "console.log", "(", '"negative"', ")", ";", "}"
    ],
    size: undefined
  },
  {
    name: "Simple Loop",
    description: "for (let i = 0; i < 10; i++) { console.log(i); }",
    example: `for (let i = 0; i < 10; i++) {\n  console.log(i);\n}`,
    difficulty: 1,
    optimalSolution: [
      "for", "(", "let", "i", "=", "0", ";", "i", "<", "10", ";", "i", "++", ")", "{", "console.log", "(", "i", ")", ";", "}"
    ],
    size: undefined
  },
  {
    name: "Function Logic",
    description: "function calculate(num) { if (num > 5) { return num + 1; } else { return 0; } }",
    example: `function calculate(num) {\n  if (num > 5) {\n    return num + 1;\n  } else {\n    return 0;\n  }\n}`,
    difficulty: 2,
    optimalSolution: [
      "function", "calculate", "(", "num", ")", "{", "if", "(", "num", ">", "5", ")", "{", "return", "num", "+", "1", ";", "}", "else", "{", "return", "0", ";", "}", "}"
    ],
    size: undefined
  },
  {
    name: "Array Operations",
    description: "let arr = [1, 2, 3]; arr.push(4); console.log(arr.length);",
    example: `let arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);`,
    difficulty: 2,
    optimalSolution: [
      "let", "arr", "=", "[", "1", ",", "2", ",", "3", "]", ";", "arr", ".", "push", "(", "4", ")", ";", "console.log", "(", "arr", ".", "length", ")", ";"
    ],
    size: undefined
  },
  {
    name: "Complex Logic",
    description: "let count = 0; for (let i = 1; i <= 100; i++) { if (i % 2 === 0) { count += i; } } console.log(count);",
    example: `let count = 0;\nfor (let i = 1; i <= 100; i++) {\n  if (i % 2 === 0) {\n    count += i;\n  }\n}\nconsole.log(count);`,
    difficulty: 3,
    optimalSolution: [
      "let", "count", "=", "0", ";", "for", "(", "let", "i", "=", "1", ";", "i", "<=", "100", ";", "i", "++", ")", "{", "if", "(", "i", "%", "2", "===", "0", ")", "{", "count", "+=", "i", ";", "}", "}", "console.log", "(", "count", ")", ";"
    ],
    size: undefined
  },
  {
    name: "Ternary Assignment",
    description: "let status = (score > 50) ? \"pass\" : \"fail\";",
    example: `let status = (score > 50) ? "pass" : "fail";`,
    difficulty: 2,
    optimalSolution: [
      "let", "status", "=", "(", "score", ">", "50", ")", "?", '"pass"', ":", '"fail"', ";"
    ],
    size: undefined
  },
  {
    name: "Comma Operator",
    description: "let a = 1, b = 2, c = 3;",
    example: `let a = 1, b = 2, c = 3;`,
    difficulty: 2,
    optimalSolution: [
      "let", "a", "=", "1", ",", "b", "=", "2", ",", "c", "=", "3", ";"
    ],
    size: undefined
  },
  {
    name: "Chained Calls",
    description: "let result = arr.map(x => x * 2).filter(x => x > 5).join(\",\");",
    example: `let result = arr.map(x => x * 2).filter(x => x > 5).join(",");`,
    difficulty: 3,
    optimalSolution: [
      "let", "result", "=", "arr", ".", "map", "(", "x", "=>", "x", "*", "2", ")", ".", "filter", "(", "x", "=>", "x", ">", "5", ")", ".", "join", "(", '","', ")", ";"
    ],
    size: undefined
  },
  {
    name: "String Template",
    description: "let msg = `Hello, ${name}!`;",
    example: "let msg = `Hello, ${name}!`;",
    difficulty: 2,
    optimalSolution: [
      "let", "msg", "=", "`Hello,", "${", "name", "}!`", ";"
    ],
    size: undefined
  },
  {
    name: "Multiple Statements",
    description: "let x = 1; let y = 2; let z = x + y;",
    example: `let x = 1; let y = 2; let z = x + y;`,
    difficulty: 1,
    optimalSolution: [
      "let", "x", "=", "1", ";", "let", "y", "=", "2", ";", "let", "z", "=", "x", "+", "y", ";"
    ],
    size: undefined
  },
]

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
