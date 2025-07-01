import type { ProgramTemplate, TokenCategory } from "@/types/game"

// New structured template type
interface StructuredTemplate {
  name: string
  description: string
  pattern: { category: TokenCategory; count: number }[]
  example: string // Example code for reference
  difficulty: number
  optimalSolution: string[] // List of token values (not just categories) that must be present in the grid
  size?: number // Optional grid size (for 7x7 enforcement)
}

export const STRUCTURED_TEMPLATES: StructuredTemplate[] = [
  {
    name: "If Statement with Declaration",
    description: "let x = 3; if (x < 5) { return x; }",
    pattern: [
      { category: "green", count: 3 }, // let x =
      { category: "red", count: 2 },   // 3 ;
      { category: "blue", count: 2 },  // if (
      { category: "green", count: 1 }, // x
      { category: "purple", count: 1 },// <
      { category: "red", count: 1 },   // 5
      { category: "blue", count: 2 },  // ) {
      { category: "orange", count: 1 },// return
      { category: "green", count: 1 }, // x
      { category: "red", count: 2 },   // ; \n
      { category: "blue", count: 1 },  // }
      { category: "red", count: 2 },   // ; \n
    ],
    example: `let x = 3;\nif (x < 5) {\n  return x;\n}`,
    difficulty: 2,
    optimalSolution: [
      "let", "x", "=", "3", ";", "\n", "if", "(", "x", "<", "5", ")", "{", "return", "x", ";", "\n", "}", ";", "\n"
    ],
    size: 7,
  },
  {
    name: "For Loop with Assignment",
    description: "for (let i = 0; i < 10; i++) { sum += i; }",
    pattern: [
      { category: "blue", count: 2 },   // for (
      { category: "green", count: 3 },  // let i =
      { category: "red", count: 2 },    // 0 ;
      { category: "green", count: 1 },  // i
      { category: "purple", count: 1 }, // <
      { category: "red", count: 1 },    // 10
      { category: "purple", count: 1 }, // ;
      { category: "green", count: 2 },  // i++
      { category: "blue", count: 2 },   // ) {
      { category: "green", count: 2 },  // sum +=
      { category: "green", count: 1 },  // i
      { category: "red", count: 2 },    // ; \n
      { category: "blue", count: 1 },   // }
      { category: "red", count: 2 },    // ; \n
    ],
    example: `for (let i = 0; i < 10; i++) {\n  sum += i;\n}`,
    difficulty: 3,
    optimalSolution: [
      "for", "(", "let", "i", "=", "0", ";", "i", "<", "10", ";", "i", "++", ")", "{", "sum", "+=", "i", ";", "\n", "}", ";", "\n"
    ],
    size: 7,
  },
  {
    name: "Function with Parameters and Return",
    description: "function add(a, b) { return a + b; }",
    pattern: [
      { category: "green", count: 2 }, // function add
      { category: "blue", count: 2 },  // (a,
      { category: "green", count: 1 }, // b
      { category: "blue", count: 2 },  // ) {
      { category: "orange", count: 1 },// return
      { category: "green", count: 1 }, // a
      { category: "purple", count: 1 },// +
      { category: "green", count: 1 }, // b
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 1 },  // }
      { category: "red", count: 2 },   // ;
    ],
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
    pattern: [
      { category: "green", count: 3 }, // let arr =
      { category: "red", count: 2 },   // [1
      { category: "red", count: 2 },   // 2,
      { category: "red", count: 2 },   // 3]
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 2 },  // for (
      { category: "green", count: 3 }, // let i =
      { category: "red", count: 2 },   // 0;
      { category: "green", count: 1 }, // i
      { category: "purple", count: 1 },// <
      { category: "green", count: 1 }, // arr
      { category: "gray", count: 1 }, // .
      { category: "cyan", count: 1 }, // length
      { category: "purple", count: 1 },// ;
      { category: "green", count: 2 }, // i++
      { category: "blue", count: 2 },  // ) {
      { category: "green", count: 1 }, // arr
      { category: "blue", count: 1 },  // [
      { category: "green", count: 1 }, // i
      { category: "blue", count: 1 },  // ]
      { category: "purple", count: 1 },// *=
      { category: "red", count: 1 },   // 2
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 1 },  // }
      { category: "red", count: 2 },   // ;
    ],
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
    pattern: [
      { category: "green", count: 3 }, // let x =
      { category: "red", count: 1 },   // 10
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 2 },  // if (
      { category: "green", count: 1 }, // x
      { category: "purple", count: 1 },// >
      { category: "red", count: 1 },   // 5
      { category: "blue", count: 2 },  // ) {
      { category: "green", count: 1 }, // x
      { category: "green", count: 1 }, // =
      { category: "green", count: 1 }, // x
      { category: "purple", count: 1 },// -
      { category: "red", count: 1 },   // 1
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 1 },  // }
      { category: "blue", count: 1 },  // else
      { category: "blue", count: 2 },  // {
      { category: "green", count: 1 }, // x
      { category: "green", count: 1 }, // =
      { category: "green", count: 1 }, // x
      { category: "purple", count: 1 },// +
      { category: "red", count: 1 },   // 1
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 1 },  // }
      { category: "red", count: 2 },   // ;
    ],
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
    pattern: [
      { category: "blue", count: 2 },  // switch (
      { category: "green", count: 1 }, // val
      { category: "blue", count: 2 },  // ) {
      { category: "blue", count: 1 },  // case
      { category: "red", count: 1 },   // 1
      { category: "purple", count: 1 },// :
      { category: "green", count: 1 }, // x
      { category: "green", count: 1 }, // =
      { category: "red", count: 1 },   // 1
      { category: "red", count: 2 },   // ;
      { category: "orange", count: 1 },// break
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 1 },  // case
      { category: "red", count: 1 },   // 2
      { category: "purple", count: 1 },// :
      { category: "green", count: 1 }, // x
      { category: "green", count: 1 }, // =
      { category: "red", count: 1 },   // 2
      { category: "red", count: 2 },   // ;
      { category: "orange", count: 1 },// break
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 1 },  // default
      { category: "purple", count: 1 },// :
      { category: "green", count: 1 }, // x
      { category: "green", count: 1 }, // =
      { category: "red", count: 1 },   // 0
      { category: "red", count: 2 },   // ;
      { category: "blue", count: 1 },  // }
      { category: "red", count: 2 },   // ;
    ],
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
    pattern: [
      { category: "green", count: 3 }, // let result =
      { category: "blue", count: 2 },  // (
      { category: "green", count: 1 }, // a
      { category: "purple", count: 1 },// >
      { category: "green", count: 1 }, // b
      { category: "blue", count: 1 },  // )
      { category: "purple", count: 1 },// ?
      { category: "green", count: 1 }, // a
      { category: "purple", count: 1 },// :
      { category: "green", count: 1 }, // b
      { category: "purple", count: 1 },// &&
      { category: "green", count: 1 }, // c
      { category: "red", count: 2 },   // ;
    ],
    example: `let result = (a > b) ? a : b && c;`,
    difficulty: 4,
    optimalSolution: [
      "let", "result", "=", "(", "a", ">", "b", ")", "?", "a", ":", "b", "&&", "c", ";"
    ],
    size: 7,
  },
]

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
