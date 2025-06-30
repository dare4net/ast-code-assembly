import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenGrid } from "./TokenGrid"

interface GameBoardProps {
  grid: (string | null)[]
  gridSize: number
  accessiblePositions: Set<number>
  gameState: any
  onTokenClick: (position: number) => void
}

export function GameBoard({ grid, gridSize, accessiblePositions, gameState, onTokenClick }: GameBoardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Grid</CardTitle>
      </CardHeader>
      <CardContent>
        <TokenGrid
          grid={grid}
          gridSize={gridSize}
          accessiblePositions={accessiblePositions}
          gameState={gameState}
          onTokenClick={onTokenClick}
        />
      </CardContent>
    </Card>
  )
}
