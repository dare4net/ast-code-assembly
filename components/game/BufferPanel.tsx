"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TOKEN_CATEGORIES } from "@/constants/tokens"
import type { BufferSlot, GameState } from "@/types/game"

interface BufferPanelProps {
  buffer: BufferSlot[]
  gameState: GameState
  onBufferClick: (index: number) => void
}

export function BufferPanel({ buffer, gameState, onBufferClick }: BufferPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buffer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {buffer.map((slot, index) => (
            <button
              key={index}
              onClick={() => onBufferClick(index)}
              disabled={!slot.token || gameState !== "playing"}
              className={`
                w-12 h-12 rounded border-2 text-xs font-bold
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
