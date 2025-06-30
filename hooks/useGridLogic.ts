"use client"

import { useState, useEffect } from "react"
import { calculateAccessiblePositions } from "@/utils/gridUtils"

export function useGridLogic(grid: (string | null)[], gridSize: number) {
  const [accessiblePositions, setAccessiblePositions] = useState<Set<number>>(new Set())

  useEffect(() => {
    setAccessiblePositions(calculateAccessiblePositions(grid, gridSize))
  }, [grid, gridSize])

  return { accessiblePositions }
}
