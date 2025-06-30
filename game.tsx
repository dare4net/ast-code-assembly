"use client"

import { useEffect } from "react"
import { useGameState } from "@/hooks/useGameState"
import { useGridLogic } from "@/hooks/useGridLogic"
import { useMobile } from "@/hooks/use-mobile"
import { getTokenCategory } from "@/utils/tokenUtils"
import { getAvailableTemplates } from "@/lib/levelGenerator"

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

    const token = removeTokenFromGrid(position)!
    const tokenCategory = getTokenCategory(token)
    const currentContainer = containers[currentContainerIndex]

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

  const handleRestartCurrent = () => {
    if (level) {
      const availableTemplates = getAvailableTemplates()
      const templateIndex = availableTemplates.findIndex((t) => t.name === level.templateName)
      initializeGame(templateIndex >= 0 ? templateIndex : undefined)
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
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Header without legend */}
          <GameHeader currentTemplate={level?.templateName} showLegend={false} />

          {/* Template Selection */}
          <GameControls
            currentTemplate={level?.templateName}
            gameState={gameState}
            collectedTokens={collectedTokens}
            onNewGame={() => initializeGame()}
            onRestartCurrent={handleRestartCurrent}
            onTemplateSelect={handleTemplateSelect}
          />

          {/* Current & Next Container at top */}
          <MobileContainerPanel containers={containers} currentContainerIndex={currentContainerIndex} />

          {/* Token Grid in middle */}
          <MobileGameBoard
            grid={grid}
            gridSize={level?.size || 5}
            accessiblePositions={accessiblePositions}
            gameState={gameState}
            onTokenClick={handleTokenClick}
          />

          {/* Buffer below grid */}
          <MobileBufferPanel buffer={buffer} gameState={gameState} onBufferClick={handleBufferClick} />

          {/* Collected tokens under buffer */}
          <MobileCollectedTokensPanel collectedTokens={collectedTokens} />

          {/* Color legend at bottom */}
          <ColorLegend />

          {/* Game Status */}
          {gameState === "complete" && (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                🎉 Congratulations! You've completed the level!
                <div className="mt-2 text-sm font-mono bg-white p-2 rounded break-all">
                  Final Program: {collectedTokens.join(" ")}
                </div>
              </div>
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

        <GameControls
          currentTemplate={level?.templateName}
          gameState={gameState}
          collectedTokens={collectedTokens}
          onNewGame={() => initializeGame()}
          onRestartCurrent={handleRestartCurrent}
          onTemplateSelect={handleTemplateSelect}
        />

        {/* Game Status */}
        {gameState === "complete" && (
          <div className="text-center mt-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              🎉 Congratulations! You've completed the level!
              <div className="mt-2 text-sm font-mono bg-white p-2 rounded">
                Final Program: {collectedTokens.join(" ")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
