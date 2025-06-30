"use client"

import { Button } from "@/components/ui/button"
import { getAvailableTemplates } from "@/lib/levelGenerator"
import { validateCode } from "@/utils/tokenUtils"
import type { GameState } from "@/types/game"

interface GameControlsProps {
  currentTemplate?: string
  gameState: GameState
  collectedTokens: string[]
  onNewGame: () => void
  onRestartCurrent: () => void
  onTemplateSelect: (index: number) => void
}

export function GameControls({
  currentTemplate,
  gameState,
  collectedTokens,
  onNewGame,
  onRestartCurrent,
  onTemplateSelect,
}: GameControlsProps) {
  const availableTemplates = getAvailableTemplates()

  const handleSubmit = () => {
    const isValid = validateCode(collectedTokens)
    const assembledCode = collectedTokens.join(" ")
    
    if (isValid) {
      alert(`Code is valid! 🎉\n\nAssembled program:\n${assembledCode}`)
    } else {
      alert(`Syntax Error! Try again.\n\nCurrent assembly:\n${assembledCode}`)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Template Selection */}
      <div className="flex flex-wrap justify-center gap-2">
        {availableTemplates.map((template) => (
          <Button
            key={template.index}
            onClick={() => onTemplateSelect(template.index)}
            variant={currentTemplate === template.name ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {template.name}
            <span className="ml-1 text-xs opacity-70">
              (L{template.difficulty})
            </span>
          </Button>
        ))}
        <Button onClick={onNewGame} variant="secondary" size="sm" className="text-xs">
          🎲 Random
        </Button>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center gap-4">
        <Button onClick={onNewGame} variant="outline">
          🎲 New Random Game
        </Button>
        <Button onClick={onRestartCurrent} variant="outline">
          🔄 Restart Current
        </Button>
        {gameState === "complete" && (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Submit Program
          </Button>
        )}
      </div>

      {/* Template Description */}
      {currentTemplate && (
        <div className="text-center max-w-md">
          <p className="text-sm text-gray-600">
            {availableTemplates.find((t) => t.name === currentTemplate)?.description}
          </p>
        </div>
      )}
    </div>
  )
}
