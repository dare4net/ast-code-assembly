"use client"

import { TOKEN_CATEGORIES } from "@/constants/tokens"
import { getTokenCategory } from "@/utils/tokenUtils"
import type { GameState } from "@/types/game"

interface TokenGridProps {
  grid: (string | null)[]
  gridSize: number
  accessiblePositions: Set<number>
  gameState: GameState
  onTokenClick: (position: number) => void
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
      {grid.map((token, index) => {
        if (token === null) {
          return <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg" />
        }

        const category = getTokenCategory(token)
        const isAccessible = accessiblePositions.has(index)
        const colorClass = TOKEN_CATEGORIES[category].color

        return (
          <button
            key={index}
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
            title={isAccessible ? `Click to collect: ${token}` : "Not accessible"}
          >
            <span className="truncate px-1">{token}</span>
          </button>
        )
      })}
    </div>
  )
}
