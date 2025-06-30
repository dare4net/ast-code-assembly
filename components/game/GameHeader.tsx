import { Badge } from "@/components/ui/badge"
import { TOKEN_CATEGORIES } from "@/constants/tokens"

interface GameHeaderProps {
  currentTemplate?: string
  showLegend?: boolean
}

export function GameHeader({ currentTemplate, showLegend = true }: GameHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Code Disassembly</h1>
      <p className="text-gray-600">Extract tokens from the outer edges to fill containers and assemble code!</p>
      {currentTemplate && (
        <div className="mt-2">
          <Badge variant="outline" className="text-lg px-3 py-1">
            Current: {currentTemplate}
          </Badge>
        </div>
      )}

      {/* Color Legend - conditionally rendered */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {Object.entries(TOKEN_CATEGORIES).map(([key, data]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${data.color.split(" ")[0]}`}></div>
              <span className="text-sm font-medium">{data.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
