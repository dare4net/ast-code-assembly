import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenGrid } from "./TokenGrid"

interface MobileGameBoardProps {
  grid: (string | null)[]
  gridSize: number
  accessiblePositions: Set<number>
  gameState: any
  onTokenClick: (position: number) => void
}

export function MobileGameBoard({
  grid,
  gridSize,
  accessiblePositions,
  gameState,
  onTokenClick,
}: MobileGameBoardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-center">Token Grid</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-full max-w-sm">
          <TokenGrid
            grid={grid}
            gridSize={gridSize}
            accessiblePositions={accessiblePositions}
            gameState={gameState}
            onTokenClick={onTokenClick}
          />
        </div>
      </CardContent>
    </Card>
  )
}
