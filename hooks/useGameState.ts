"use client"

import { useState, useCallback } from "react"
import type { GameState, Container, BufferSlot, ValidatedLevel } from "@/types/game"
import { generateLevel } from "@/lib/levelGenerator"

export function useGameState() {
  const [level, setLevel] = useState<ValidatedLevel | null>(null)
  const [grid, setGrid] = useState<(string | null)[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [currentContainerIndex, setCurrentContainerIndex] = useState(0)
  const [buffer, setBuffer] = useState<BufferSlot[]>(Array(5).fill({ token: null, category: null }))
  const [collectedTokens, setCollectedTokens] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameState>("playing")

  const initializeGame = useCallback((templateIndex?: number) => {
    const newLevel = generateLevel(templateIndex)
    
    // Only proceed if level is valid
    if (!newLevel.isValid) {
      console.error("Generated level is invalid, retrying...")
      // Try again with a different template or fallback
      const fallbackLevel = generateLevel(0) // Use first template as fallback
      if (!fallbackLevel.isValid) {
        console.error("Fallback level also invalid!")
        return
      }
      setLevel(fallbackLevel)
    } else {
      setLevel(newLevel)
    }

    setGrid([...newLevel.gridTokens])
    setContainers(
      newLevel.containerRequests.map((req) => ({
        category: req.category,
        count: req.count,
        collected: [],
      })),
    )
    setCurrentContainerIndex(0)
    setBuffer(Array(5).fill({ token: null, category: null }))
    setCollectedTokens([])
    setGameState("playing")
  }, [])

  const addTokenToContainer = useCallback(
    (token: string) => {
      const newContainers = [...containers]
      newContainers[currentContainerIndex].collected.push(token)
      setContainers(newContainers)
      setCollectedTokens((prev) => [...prev, token])

      // Check if container is complete
      if (newContainers[currentContainerIndex].collected.length === newContainers[currentContainerIndex].count) {
        if (currentContainerIndex < containers.length - 1) {
          setCurrentContainerIndex((prev) => prev + 1)
        } else {
          setGameState("complete")
        }
      }
    },
    [containers, currentContainerIndex],
  )

  const addTokenToBuffer = useCallback(
    (token: string, category: any) => {
      const emptyBufferIndex = buffer.findIndex((slot) => slot.token === null)
      if (emptyBufferIndex !== -1) {
        const newBuffer = [...buffer]
        newBuffer[emptyBufferIndex] = { token, category }
        setBuffer(newBuffer)
        return true
      }
      return false
    },
    [buffer],
  )

  const removeTokenFromBuffer = useCallback(
    (bufferIndex: number) => {
      const newBuffer = [...buffer]
      const token = newBuffer[bufferIndex].token
      newBuffer[bufferIndex] = { token: null, category: null }
      setBuffer(newBuffer)
      return token
    },
    [buffer],
  )

  const removeTokenFromGrid = useCallback(
    (position: number) => {
      const newGrid = [...grid]
      const token = newGrid[position]
      newGrid[position] = null
      setGrid(newGrid)
      return token
    },
    [grid],
  )

  return {
    // State
    level,
    grid,
    containers,
    currentContainerIndex,
    buffer,
    collectedTokens,
    gameState,

    // Actions
    initializeGame,
    addTokenToContainer,
    addTokenToBuffer,
    removeTokenFromBuffer,
    removeTokenFromGrid,
  }
}
