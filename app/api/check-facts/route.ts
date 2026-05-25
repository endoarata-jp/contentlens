import { type NextRequest } from "next/server"
import { checkFacts, braveSearch } from "@/lib/fact-checker"

export async function POST(request: NextRequest) {
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  const braveKey = process.env.BRAVE_API_KEY

  if (!deepseekKey) return Response.json({ error: "サーバー設定エラー" }, { status: 500 })

  const { article } = await request.json()
  if (!article) return Response.json({ error: "記事を入力してください" }, { status: 400 })

  try {
    const results = await checkFacts(article, deepseekKey)

    if (braveKey && braveKey !== "your-brave-api-key-here") {
      for (const r of results) {
        if (r.verdict === "unverified") {
          const sources = await braveSearch(r.claim, braveKey)
          if (sources.length > 0) {
            r.sources = sources
            r.verdict = "verified"
            r.evidence = `出典: ${sources[0].title}`
          }
        }
      }
    }

    return Response.json(results)
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
