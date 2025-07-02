import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TOKEN_CATEGORIES } from "@/constants/tokens"
import type { Container } from "@/types/game"
import { getPastelBgForCategory } from "./containerPastelBg"

interface ContainerPanelProps {
  containers: Container[]
  currentContainerIndex: number
}

export function ContainerPanel({ containers, currentContainerIndex }: ContainerPanelProps) {
  const currentContainer = containers[currentContainerIndex]
  const nextContainer = currentContainerIndex < containers.length - 1 ? containers[currentContainerIndex + 1] : null

  return (
    <div className="space-y-4">
      {/* Current Container */}
      <Card style={{ background: getPastelBgForCategory(currentContainer.category) }}>
        <CardHeader>
          <CardTitle>Current Container</CardTitle>
        </CardHeader>
        <CardContent>
          {currentContainer && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded ${TOKEN_CATEGORIES[currentContainer.category].color.split(" ")[0]}`}
                ></div>
                <span className="font-medium">{TOKEN_CATEGORIES[currentContainer.category].name}</span>
              </div>
              <Progress value={(currentContainer.collected.length / currentContainer.count) * 100} className="w-full" />
              <div className="text-sm text-gray-600">
                {currentContainer.collected.length} / {currentContainer.count} tokens
              </div>
              <div className="flex flex-wrap gap-1">
                {currentContainer.collected.map((token, idx) => (
                  <Badge key={idx} variant="secondary">
                    {token}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Container */}
      {nextContainer && (
        <Card>
          <CardHeader>
            <CardTitle>Next Container</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${TOKEN_CATEGORIES[nextContainer.category].color.split(" ")[0]}`}></div>
              <span className="text-sm">{TOKEN_CATEGORIES[nextContainer.category].name}</span>
              <span className="text-sm text-gray-600">({nextContainer.count} tokens)</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
