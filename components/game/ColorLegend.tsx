import { TOKEN_CATEGORIES } from "@/constants/tokens"

export function ColorLegend() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3 text-center">Token Categories</h3>
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(TOKEN_CATEGORIES).map(([key, data]) => (
          <div key={key} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded ${data.color.split(" ")[0]} flex-shrink-0`}></div>
            <span className="text-sm font-medium">{data.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
