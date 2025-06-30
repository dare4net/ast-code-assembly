# Code Disassembly Game - Complete Documentation

## Table of Contents
1. [Game Overview](#game-overview)
2. [Game Logic & Rules](#game-logic--rules)
3. [Technical Architecture](#technical-architecture)
4. [UI Components](#ui-components)
5. [Game Flow](#game-flow)
6. [Token System](#token-system)
7. [Level Generation](#level-generation)
8. [Mobile Responsiveness](#mobile-responsiveness)
9. [File Structure](#file-structure)
10. [API Reference](#api-reference)
11. [Development Guide](#development-guide)

---

## Game Overview

**Code Disassembly** is an educational puzzle game that teaches programming concepts through interactive token collection. Players extract code tokens from a 2D grid to assemble meaningful JavaScript programs.

### Core Concept
- **Grid-based puzzle**: Tokens are arranged in a square grid (5x5 to 8x8)
- **Edge accessibility**: Only outer edge tokens are initially accessible
- **Container system**: Tokens must be collected in specific categories and quantities
- **Program assembly**: Collected tokens form valid JavaScript code

### Educational Goals
- **Syntax recognition**: Learn to identify different code elements
- **Program structure**: Understand how code components fit together
- **Logic flow**: Experience the sequence of programming constructs
- **Pattern recognition**: Recognize common programming patterns

---

## Game Logic & Rules

### 1. Grid Accessibility Rules
\`\`\`
Initial State: Only outer perimeter tokens are clickable
┌─────────────┐
│ A B C D E   │ ← All accessible
│ F ■ ■ ■ G   │ ← Only F,G accessible  
│ H ■ ■ ■ I   │ ← Only H,I accessible
│ J ■ ■ ■ K   │ ← Only J,K accessible
│ L M N O P   │ ← All accessible
└─────────────┘

After removing A:
┌─────────────┐
│ ■ B C D E   │ 
│ F X ■ ■ G   │ ← X becomes accessible
│ H ■ ■ ■ I   │ 
│ J ■ ■ ■ K   │ 
│ L M N O P   │ 
└─────────────┘
\`\`\`

### 2. Token Collection Rules
- **Primary placement**: Tokens go to active container if category matches
- **Buffer fallback**: Non-matching tokens go to buffer (5 slots max)
- **Wild tokens**: Gray tokens can fill any container
- **Buffer retrieval**: Click buffer tokens to retry placement

### 3. Container Progression
- **Sequential filling**: Complete current container before next activates
- **Category-based**: Each container requests specific token categories
- **Count-based**: Each container needs exact number of tokens
- **Automatic progression**: Game advances when container is full

### 4. Win Conditions
- **Complete all containers**: Fill every container in sequence
- **Valid program**: Assembled tokens form syntactically correct code
- **No deadlock**: Solution path must always exist

---

## Technical Architecture

### Core Technologies
- **React 18**: Component-based UI with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Next.js**: App Router framework

### Architecture Patterns
- **Custom Hooks**: State management and game logic
- **Component Composition**: Modular UI components
- **Type Safety**: Comprehensive TypeScript interfaces
- **Responsive Design**: Mobile-first approach

### Key Design Principles
- **Separation of Concerns**: Logic, UI, and data are separated
- **Immutable State**: State updates use immutable patterns
- **Pure Functions**: Utility functions have no side effects
- **Validation First**: All levels validated before rendering

---

## UI Components

### Desktop Layout
\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Game Header                          │
│                 (Title + Legend)                        │
├─────────────────────────────┬───────────────────────────┤
│                             │     Container Panel       │
│        Token Grid           │   (Current + Next)        │
│      (Interactive)          ├───────────────────────────┤
│                             │     Buffer Panel          │
│                             │    (5 temp slots)         │
│                             ├───────────────────────────┤
│                             │  Collected Tokens Panel   │
│                             │   (Assembled code)        │
└─────────────────────────────┴───────────────────────────┘
│                  Game Controls                          │
│            (Templates + Actions)                        │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Mobile Layout
\`\`\`
┌─────────────────────────────┐
│        Game Header          │
│      (Title only)           │
├─────────────────────────────┤
│      Game Controls          │
│   (Template selection)      │
├─────────────────────────────┤
│    Container Panel          │
│   (Current + Next)          │
├─────────────────────────────┤
│      Token Grid             │
│    (Touch optimized)        │
├─────────────────────────────┤
│     Buffer Panel            │
│    (5 temp slots)           │
├─────────────────────────────┤
│  Collected Tokens Panel     │
│   (Assembled code)          │
├─────────────────────────────┤
│     Color Legend            │
│   (Token categories)        │
└─────────────────────────────┘
\`\`\`

### Component Hierarchy
\`\`\`
CodeDisassemblyGame
├── GameHeader
├── Desktop Layout
│   ├── GameBoard
│   │   └── TokenGrid
│   ├── ContainerPanel
│   ├── BufferPanel
│   └── CollectedTokensPanel
├── Mobile Layout
│   ├── MobileContainerPanel
│   ├── MobileGameBoard
│   │   └── TokenGrid
│   ├── MobileBufferPanel
│   ├── MobileCollectedTokensPanel
│   └── ColorLegend
└── GameControls
\`\`\`

---

## Game Flow

### 1. Initialization
\`\`\`typescript
// Game starts with level generation
const level = generateLevel(templateIndex?)
// Level contains:
// - gridTokens: Array of tokens placed in grid
// - containerRequests: Sequence of containers to fill
// - templateName: Which program template is being used
// - isValid: Whether level is solvable
\`\`\`

### 2. Player Actions
\`\`\`typescript
// Token Click Flow
handleTokenClick(position) {
  if (!accessible || !token || gameState !== "playing") return
  
  const token = removeFromGrid(position)
  const category = getTokenCategory(token)
  
  if (matchesCurrentContainer(token, category)) {
    addToContainer(token)
    checkContainerComplete()
  } else {
    addToBuffer(token, category)
  }
}

// Buffer Click Flow
handleBufferClick(bufferIndex) {
  const token = removeFromBuffer(bufferIndex)
  if (matchesCurrentContainer(token)) {
    addToContainer(token)
    checkContainerComplete()
  }
}
\`\`\`

### 3. State Transitions
\`\`\`
PLAYING → Token collected → Container filled → Next container
       → All containers filled → COMPLETE
       → Invalid state → GAME_OVER
\`\`\`

### 4. Validation
\`\`\`typescript
// Level validation ensures:
// 1. All required tokens exist in grid
// 2. Tokens can be accessed in valid order
// 3. Container sequence produces meaningful program
// 4. No impossible states exist
\`\`\`

---

## Token System

### Token Categories
| Category | Color | Description | Examples |
|----------|-------|-------------|----------|
| **Blue** | 🔵 | Control Structures | `if`, `else`, `for`, `while`, `{`, `}`, `(`, `)` |
| **Green** | 🟢 | Declarations & Variables | `let`, `const`, `function`, `=`, `x`, `value` |
| **Orange** | 🟠 | Jump & Flow Control | `return`, `break`, `continue`, `throw` |
| **Purple** | 🟣 | Operators & Logic | `+`, `-`, `*`, `==`, `&&`, `||`, `<`, `>` |
| **Red** | 🔴 | Literals & Values | `0`, `1`, `true`, `false`, `"hello"`, `null` |
| **Cyan** | 🔵 | Built-ins & Methods | `console.log`, `Math.max`, `parseInt` |
| **Gray** | ⚪ | Wild (Universal) | `;`, `,`, `.`, `"`, `'` |

### Token Classification Logic
\`\`\`typescript
function getTokenCategory(token: string): TokenCategory {
  // Check each category's token list
  for (const [category, data] of Object.entries(TOKEN_CATEGORIES)) {
    if (data.tokens.includes(token)) {
      return category as TokenCategory
    }
  }
  return "gray" // Default to wild
}
\`\`\`

### Wild Token Rules
- **Universal acceptance**: Gray tokens accepted by any container
- **Punctuation focus**: Semicolons, commas, quotes, dots
- **Flexibility**: Helps prevent impossible game states
- **Strategic use**: Players can use for any container when needed

---

## Level Generation

### Program-First Approach
\`\`\`typescript
// 1. Start with complete JavaScript program
const program = `let x = 5;
if (x > 0) {
  console.log("positive");
} else {
  console.log("negative");
}`

// 2. Parse into tokens
const tokens = parseProgram(program)
// Result: ["let", "x", "=", "5", ";", "if", "(", "x", ">", "0", ")", ...]

// 3. Generate container sequence
const containers = generateContainers(tokens)
// Result: [
//   { category: "green", count: 4 },  // let, x, =, variable
//   { category: "blue", count: 6 },   // if, (, ), {, }, else
//   { category: "purple", count: 2 }, // >, comparison
//   ...
// ]

// 4. Arrange in grid with validation
const level = validateLevel(tokens, containers, gridSize)
\`\`\`

### Available Program Templates
1. **Basic Conditional** (Difficulty 1)
   \`\`\`javascript
   let x = 5;
   if (x > 0) {
     console.log("positive");
   } else {
     console.log("negative");
   }
   \`\`\`

2. **Simple Loop** (Difficulty 1)
   \`\`\`javascript
   for (let i = 0; i < 10; i++) {
     console.log(i);
   }
   \`\`\`

3. **Function Logic** (Difficulty 2)
   \`\`\`javascript
   function calculate(num) {
     if (num > 5) {
       return num + 1;
     } else {
       return 0;
     }
   }
   \`\`\`

4. **Array Operations** (Difficulty 2)
   \`\`\`javascript
   let arr = [1, 2, 3];
   arr.push(4);
   console.log(arr.length);
   \`\`\`

5. **Complex Logic** (Difficulty 3)
   \`\`\`javascript
   let count = 0;
   for (let i = 1; i <= 100; i++) {
     if (i % 2 === 0) {
       count += i;
     }
   }
   console.log(count);
   \`\`\`

### Grid Placement Algorithm
\`\`\`typescript
// Spiral placement ensures accessibility
function placeTokensInGrid(tokens: string[], size: number) {
  // Place tokens in spiral pattern: outside → inside
  // Ensures outer tokens are always accessible
  // Inner tokens become accessible as outer ones are removed
}
\`\`\`

---

## Mobile Responsiveness

### Breakpoint Strategy
- **Mobile**: < 768px width
- **Desktop**: ≥ 768px width
- **Dynamic detection**: `useMobile()` hook with resize listener

### Mobile Optimizations
- **Touch targets**: Larger button sizes for finger interaction
- **Vertical layout**: Single column stack instead of side-by-side
- **Compact headers**: Reduced padding and font sizes
- **Scrollable content**: Proper overflow handling
- **Gesture support**: Touch-friendly interactions

### Layout Differences
| Element | Desktop | Mobile |
|---------|---------|---------|
| **Grid Size** | 400px max-width | 100% width |
| **Layout** | 3-column grid | Single column |
| **Legend** | In header | Separate bottom section |
| **Controls** | Bottom | Top (after header) |
| **Token Size** | Fixed 64px | Responsive aspect-ratio |

---

## File Structure

\`\`\`
/
├── game.tsx                     # Main game component
├── app/
│   └── page.tsx                 # Next.js page entry
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── game/                    # Game-specific components
│       ├── GameHeader.tsx       # Title, legend, template display
│       ├── GameBoard.tsx        # Desktop grid container
│       ├── TokenGrid.tsx        # Interactive token grid
│       ├── ContainerPanel.tsx   # Desktop container display
│       ├── BufferPanel.tsx      # Desktop buffer slots
│       ├── CollectedTokensPanel.tsx # Desktop token collection
│       ├── GameControls.tsx     # Template selection & actions
│       ├── ColorLegend.tsx      # Separate legend component
│       ├── MobileContainerPanel.tsx    # Mobile container display
│       ├── MobileGameBoard.tsx         # Mobile grid container
│       ├── MobileBufferPanel.tsx       # Mobile buffer slots
│       └── MobileCollectedTokensPanel.tsx # Mobile token collection
├── hooks/
│   ├── useGameState.ts          # Main game state management
│   ├── useGridLogic.ts          # Grid accessibility logic
│   └── use-mobile.tsx           # Mobile device detection
├── lib/
│   ├── levelGenerator.ts        # Dynamic level generation
│   ├── programParser.ts         # Program → tokens parsing
│   └── levelValidator.ts        # Level validation logic
├── utils/
│   ├── tokenUtils.ts            # Token categorization & validation
│   └── gridUtils.ts             # Grid calculation utilities
├── types/
│   └── game.ts                  # TypeScript interfaces
├── constants/
│   ├── tokens.ts                # Token categories & definitions
│   └── templates.ts             # Program templates
└── GAME_DOCUMENTATION.md        # This documentation
\`\`\`

---

## API Reference

### Core Hooks

#### `useGameState()`
\`\`\`typescript
const {
  // State
  level: ValidatedLevel | null,
  grid: (string | null)[],
  containers: Container[],
  currentContainerIndex: number,
  buffer: BufferSlot[],
  collectedTokens: string[],
  gameState: GameState,
  
  // Actions
  initializeGame: (templateIndex?: number) => void,
  addTokenToContainer: (token: string) => void,
  addTokenToBuffer: (token: string, category: TokenCategory) => boolean,
  removeTokenFromBuffer: (index: number) => string | null,
  removeTokenFromGrid: (position: number) => string | null,
} = useGameState()
\`\`\`

#### `useGridLogic(grid, gridSize)`
\`\`\`typescript
const {
  accessiblePositions: Set<number>
} = useGridLogic(grid, gridSize)
\`\`\`

#### `useMobile()`
\`\`\`typescript
const isMobile: boolean = useMobile()
\`\`\`

### Core Functions

#### `generateLevel(templateIndex?: number): ValidatedLevel`
\`\`\`typescript
// Generates a new game level
// Returns validated level with grid, containers, and solution path
\`\`\`

#### `parseProgram(code: string): ParsedProgram`
\`\`\`typescript
// Parses JavaScript code into tokens and container sequence
// Returns tokens array and optimal collection order
\`\`\`

#### `validateLevel(parsed: ParsedProgram, gridSize: number, templateName: string): ValidatedLevel`
\`\`\`typescript
// Validates that a level is solvable
// Returns level with isValid flag
\`\`\`

#### `getTokenCategory(token: string): TokenCategory`
\`\`\`typescript
// Categorizes a token by its programming role
// Returns color category for UI display
\`\`\`

### Type Definitions

#### Core Types
\`\`\`typescript
type GameState = "playing" | "complete" | "game-over"
type TokenCategory = "blue" | "green" | "orange" | "purple" | "red" | "cyan" | "gray"

interface Container {
  category: TokenCategory
  count: number
  collected: string[]
}

interface ValidatedLevel {
  size: number
  gridTokens: (string | null)[]
  containerRequests: { category: TokenCategory; count: number }[]
  templateName: string
  solutionPath: number[]
  isValid: boolean
}
\`\`\`

---

## Development Guide

### Getting Started
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

### Adding New Program Templates
\`\`\`typescript
// 1. Add to constants/templates.ts
export const PROGRAM_DEFINITIONS = [
  // ... existing templates
  {
    name: "New Template",
    description: "Description of what this teaches",
    program: `// Your JavaScript code here
    let example = "code";
    console.log(example);`,
    difficulty: 2,
  }
]
\`\`\`

### Adding New Token Categories
\`\`\`typescript
// 1. Update types/game.ts
type TokenCategory = "blue" | "green" | "orange" | "purple" | "red" | "cyan" | "gray" | "newCategory"

// 2. Add to constants/tokens.ts
export const TOKEN_CATEGORIES = {
  // ... existing categories
  newCategory: {
    name: "New Category Name",
    tokens: ["token1", "token2", "token3"],
    color: "bg-indigo-500 hover:bg-indigo-600",
  }
}
\`\`\`

### Debugging Tips
\`\`\`typescript
// Enable debug logging in levelGenerator.ts
console.log(`Level "${programDef.name}" validation:`, level.isValid ? 'VALID' : 'INVALID')

// Check token accessibility in browser console
console.log('Accessible positions:', Array.from(accessiblePositions))

// Validate token categorization
console.log('Token category:', getTokenCategory('your-token'))
\`\`\`

### Testing Strategy
- **Unit tests**: Test utility functions and token categorization
- **Integration tests**: Test level generation and validation
- **E2E tests**: Test complete game flows
- **Mobile testing**: Test responsive behavior on various devices

### Performance Considerations
- **Memoization**: Use React.memo for expensive components
- **State optimization**: Minimize re-renders with proper dependency arrays
- **Grid calculations**: Cache accessibility calculations when possible
- **Mobile optimization**: Reduce animation complexity on mobile devices

### Accessibility Features
- **Keyboard navigation**: Support tab navigation through interactive elements
- **Screen readers**: Proper ARIA labels and semantic HTML
- **Color contrast**: Ensure sufficient contrast for all token categories
- **Touch targets**: Minimum 44px touch targets on mobile

---

## Conclusion

The Code Disassembly Game combines educational programming concepts with engaging puzzle mechanics. Its modular architecture, comprehensive validation system, and responsive design make it both maintainable and accessible across devices.

The program-first approach ensures that every level produces meaningful, valid JavaScript code, making it an effective tool for teaching programming concepts through interactive gameplay.

---

*Last updated: December 2024*
*Version: 1.0.0*
