"use client"

import { TOKEN_CATEGORIES } from "@/constants/tokens"
import { getTokenCategory } from "@/utils/tokenUtils"
import type { GameState } from "@/types/game"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface TokenGridProps {
  grid: (string | null)[]
  gridSize: number
  accessiblePositions: Set<number>
  gameState: GameState
  onTokenClick: (position: number) => void
}

function getShortToken(token: string) {
  // If token is longer than 3 chars, show only first 3 chars
  return token.length > 3 ? token.slice(0, 3) : token
}

export function TokenGrid({ grid, gridSize, accessiblePositions, gameState, onTokenClick }: TokenGridProps) {
  return (
    <div
      className="grid gap-2 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        maxWidth: "400px", // Restore original 400px max width for desktop
      }}
    >
      <TooltipProvider>
        {grid.map((token, index) => {
          if (token === null) {
            return (<div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg" />)
          }

          // Special handling for [empty] token
          if (token === '[empty]') {
            const isAccessible = accessiblePositions.has(index)
            const colorClass = TOKEN_CATEGORIES.empty.color
            return (
              <button
                key={index}
                onClick={() => isAccessible && gameState === "playing" && onTokenClick(index)}
                disabled={!isAccessible || gameState !== "playing"}
                className={`
                  aspect-square rounded-lg font-bold text-xs border-2 flex items-center justify-center
                  ${isAccessible && gameState === "playing"
                    ? `${colorClass} border-white cursor-pointer hover:scale-105` 
                    : `${colorClass.split(" ")[0]} opacity-50 border-gray-400 cursor-not-allowed`}
                `}
                aria-label="Empty token"
              >
                <span className="px-1">---</span>
              </button>
            )
          }

          const category = getTokenCategory(token)
          const isAccessible = accessiblePositions.has(index)
          const colorClass = TOKEN_CATEGORIES[category].color

          // Fix: ensure token is defined for tooltip and button
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onTokenClick(index)}
                  disabled={!isAccessible || gameState !== "playing"}
                  className={`
                    aspect-square rounded-lg text-white font-bold text-xs
                    transition-all duration-200 border-2 flex items-center justify-center
                    ${
                      isAccessible && gameState === "playing"
                        ? `${colorClass} border-white cursor-pointer transform hover:scale-105 shadow-lg`
                        : `${colorClass.split(" ")[0]} opacity-50 border-gray-400 cursor-not-allowed`
                    }
                  `}
                >
                  <span className="px-1">{getShortToken(token ?? "")}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span className="font-mono text-base">{token ?? ""}</span>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
