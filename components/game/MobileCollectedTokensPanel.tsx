import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MobileCollectedTokensPanelProps {
  collectedTokens: string[]
}

export function MobileCollectedTokensPanel({ collectedTokens }: MobileCollectedTokensPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Collected Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-mono bg-gray-100 p-3 rounded min-h-[60px] break-all">
          {collectedTokens.length > 0 ? collectedTokens.join(" ") : "No tokens collected yet..."}
        </div>
      </CardContent>
    </Card>
  )
}
