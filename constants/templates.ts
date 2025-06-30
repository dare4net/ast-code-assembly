import type { ProgramTemplate } from "@/types/game"

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
]

// Legacy export for backward compatibility - will be replaced by program parser
export const PROGRAM_TEMPLATES: ProgramTemplate[] = []
