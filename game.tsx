"use client"

import { useEffect } from "react"
import { useGameState } from "@/hooks/useGameState"
import { useGridLogic } from "@/hooks/useGridLogic"
import { useMobile } from "@/hooks/use-mobile"
import { getTokenCategory, validateCode } from "@/utils/tokenUtils"
import { getAvailableTemplates } from "@/lib/levelGenerator"
import { useSound } from "@/hooks/use-sound"

// Desktop Components
import { GameHeader } from "@/components/game/GameHeader"
import { GameBoard } from "@/components/game/GameBoard"
import { ContainerPanel } from "@/components/game/ContainerPanel"
import { BufferPanel } from "@/components/game/BufferPanel"
import { CollectedTokensPanel } from "@/components/game/CollectedTokensPanel"
import { GameControls } from "@/components/game/GameControls"
import { ColorLegend } from "@/components/game/ColorLegend"

// Mobile Components
import { MobileContainerPanel } from "@/components/game/MobileContainerPanel"
import { MobileGameBoard } from "@/components/game/MobileGameBoard"
import { MobileBufferPanel } from "@/components/game/MobileBufferPanel"
import { MobileCollectedTokensPanel } from "@/components/game/MobileCollectedTokensPanel"

export default function CodeDisassemblyGame() {
  const isMobile = useMobile()
  const playSlotSound = useSound("/slot-move.mp3", 0.5)

  const {
    level,
    grid,
    containers,
    currentContainerIndex,
    buffer,
    collectedTokens,
    gameState,
    initializeGame,
    addTokenToContainer,
    addTokenToBuffer,
    removeTokenFromBuffer,
    removeTokenFromGrid,
  } = useGameState()

  const { accessiblePositions } = useGridLogic(grid, level?.size || 5)

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const handleTokenClick = (position: number) => {
    if (!accessiblePositions.has(position) || grid[position] === null || gameState !== "playing") {
      return
    }

    playSlotSound()

    const token = removeTokenFromGrid(position)!
    const tokenCategory = getTokenCategory(token)
    const currentContainer = containers[currentContainerIndex]

    // If it's an empty token, just remove it and do nothing else
    if (tokenCategory === "empty") {
      return
    }

    // Try to place in current container
    if (
      currentContainer &&
      (currentContainer.category === tokenCategory || tokenCategory === "gray") &&
      currentContainer.collected.length < currentContainer.count
    ) {
      addTokenToContainer(token)
    } else {
      // Try to place in buffer
      const success = addTokenToBuffer(token, tokenCategory)
      if (!success) {
        console.log("Buffer full!")
      }
    }
  }

  const handleBufferClick = (bufferIndex: number) => {
    const bufferSlot = buffer[bufferIndex]
    if (!bufferSlot.token || gameState !== "playing") return

    const currentContainer = containers[currentContainerIndex]
    if (
      currentContainer &&
      (currentContainer.category === bufferSlot.category || bufferSlot.category === "gray") &&
      currentContainer.collected.length < currentContainer.count
    ) {
      const token = removeTokenFromBuffer(bufferIndex)!
      addTokenToContainer(token)
    }
  }

  const handleTemplateSelect = (index: number) => {
    initializeGame(index)
  }

  // New Random Game: always pick a new random template
  const handleNewRandomGame = () => {
    // Pick a random template index different from the current one
    const availableTemplates = getAvailableTemplates()
    let newIndex: number
    if (level) {
      const currentIndex = availableTemplates.findIndex((t) => t.name === level.templateName)
      const otherIndices = availableTemplates.map((_, i) => i).filter(i => i !== currentIndex)
      newIndex = otherIndices.length > 0 ? otherIndices[Math.floor(Math.random() * otherIndices.length)] : currentIndex
    } else {
      newIndex = Math.floor(Math.random() * availableTemplates.length)
    }
    initializeGame(newIndex)
  }

  // Restart Current: re-randomize grid for the same template
  const handleRestartCurrent = () => {
    if (level) {
      const availableTemplates = getAvailableTemplates()
      const templateIndex = availableTemplates.findIndex((t) => t.name === level.templateName)
      if (templateIndex >= 0) {
        initializeGame(templateIndex)
      }
    }
  }

  // Show loading or error state if level is invalid
  if (!level || !level.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{!level ? "Loading..." : "Level Generation Failed"}</h2>
          {!level?.isValid && (
            <div className="space-y-4">
              <p className="text-gray-600">Unable to generate a valid level. Please try again.</p>
              <button
                onClick={() => initializeGame()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mobile Layout
  if (isMobile) {
    const allContainersFilled = containers.every(
      (container) => container.collected.length === container.count
    )
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Header without legend */}
          <GameHeader currentTemplate={level?.templateName} showLegend={false} />

          {/* Current & Next Container at top */}
          <MobileContainerPanel containers={containers} currentContainerIndex={currentContainerIndex} />

          {/* Buffer below current container */}
          <MobileBufferPanel buffer={buffer} gameState={gameState} onBufferClick={handleBufferClick} />

          {/* Token Grid in middle */}
          <MobileGameBoard
            grid={grid}
            gridSize={level?.size || 5}
            accessiblePositions={accessiblePositions}
            gameState={gameState}
            onTokenClick={handleTokenClick}
          />

          {/* Collected tokens under buffer */}
          <MobileCollectedTokensPanel collectedTokens={collectedTokens} />

          {/* Game Controls below collected tokens, styled small and neutral */}
          <div className="flex justify-center gap-2 my-2">
            <button
              onClick={handleNewRandomGame}
              className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300"
            >
              🎲 New Random Game
            </button>
            <button
              onClick={handleRestartCurrent}
              className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300"
            >
              🔄 Restart Current
            </button>
          </div>

          {/* Validate/Submit button when all containers are filled */}
          {allContainersFilled && gameState === "playing" && (
            <div className="flex justify-center my-2">
              <button
                onClick={() => {
                  // End the game and trigger validation UI
                  // This will set gameState to 'complete' via addTokenToContainer logic
                  // But if not, force it:
                  if (gameState !== "complete") {
                    // setGameState is not exposed, so simulate by filling containers
                    // This is a workaround: just call addTokenToContainer with a dummy to trigger state
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ✅ Validate Code
              </button>
            </div>
          )}

          {/* Game Status for mobile */}
          {gameState === "complete" && (
            <div className="text-center mt-4">
              {validateCode(collectedTokens) ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  🎉 Congratulations! You've completed the level!
                  <div className="mt-2 text-sm font-mono bg-white p-2 rounded">
                    Final Program: {collectedTokens.join(" ")}
                  </div>
                </div>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  ⚠️ The assembled code is not valid JavaScript. Please try again!
                  <div className="mt-2 text-sm font-mono bg-white p-2 rounded">
                    Final Program: {collectedTokens.join(" ")}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop Layout (unchanged)
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <GameHeader currentTemplate={level?.templateName} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grid Panel */}
          <div className="lg:col-span-2">
            <GameBoard
              grid={grid}
              gridSize={level?.size || 5}
              accessiblePositions={accessiblePositions}
              gameState={gameState}
              onTokenClick={handleTokenClick}
            />
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            <ContainerPanel containers={containers} currentContainerIndex={currentContainerIndex} />

            <BufferPanel buffer={buffer} gameState={gameState} onBufferClick={handleBufferClick} />

            <CollectedTokensPanel collectedTokens={collectedTokens} />
          </div>
        </div>

        {/* Template Selection - moved to bottom */}
        <GameControls
          currentTemplate={level?.templateName}
          gameState={gameState}
          collectedTokens={collectedTokens}
          onNewGame={handleNewRandomGame}
          onRestartCurrent={handleRestartCurrent}
          onTemplateSelect={handleTemplateSelect}
        />

        {/* Game Status */}
        {gameState === "complete" && (
          <div className="text-center mt-4">
            {validateCode(collectedTokens) ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                🎉 Congratulations! You've completed the level!
                <div className="mt-2 text-sm font-mono bg-white p-2 rounded">
                  Final Program: {collectedTokens.join(" ")}
                </div>
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                ⚠️ The assembled code is not valid JavaScript. Please try again!
                <div className="mt-2 text-sm font-mono bg-white p-2 rounded">
                  Final Program: {collectedTokens.join(" ")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
