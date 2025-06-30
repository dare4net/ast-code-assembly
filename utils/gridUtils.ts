export function calculateAccessiblePositions(grid: (string | null)[], gridSize: number): Set<number> {
  const accessible = new Set<number>()

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === null) continue

    const row = Math.floor(i / gridSize)
    const col = i % gridSize

    // Check if position is on the outer edge or adjacent to a removed block
    const isEdge = row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1
    const hasRemovedNeighbor = [
      i - gridSize, // top
      i + gridSize, // bottom
      i - 1, // left
      i + 1, // right
    ].some((neighborIndex) => {
      if (neighborIndex < 0 || neighborIndex >= grid.length) return false

      // Check bounds for left/right neighbors
      if ((i % gridSize === 0 && neighborIndex === i - 1) || (i % gridSize === gridSize - 1 && neighborIndex === i + 1))
        return false

      return grid[neighborIndex] === null
    })

    if (isEdge || hasRemovedNeighbor) {
      accessible.add(i)
    }
  }

  return accessible
}
