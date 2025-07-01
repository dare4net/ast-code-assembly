"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TOKEN_CATEGORIES } from "@/constants/tokens"
import type { BufferSlot, GameState } from "@/types/game"

interface MobileBufferPanelProps {
  buffer: BufferSlot[]
  gameState: GameState
  onBufferClick: (index: number) => void
}

export function MobileBufferPanel({ buffer, gameState, onBufferClick }: MobileBufferPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Buffer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
          {buffer.map((slot, index) => (
            <button
              key={index}
              onClick={() => onBufferClick(index)}
              disabled={!slot.token || gameState !== "playing"}
              className={`
                aspect-square rounded border-2 text-xs font-bold
                ${
                  slot.token
                    ? `${TOKEN_CATEGORIES[slot.category!].color} text-white cursor-pointer hover:scale-105`
                    : "border-dashed border-gray-300 bg-gray-50"
                }
              `}
            >
              {slot.token || ""}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
