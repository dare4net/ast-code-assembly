import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CollectedTokensPanelProps {
  collectedTokens: string[]
}

export function CollectedTokensPanel({ collectedTokens }: CollectedTokensPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collected Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-mono bg-gray-100 p-3 rounded min-h-[60px]">
          {collectedTokens.length > 0 ? collectedTokens.join(" ") : "No tokens collected yet..."}
        </div>
      </CardContent>
    </Card>
  )
}
