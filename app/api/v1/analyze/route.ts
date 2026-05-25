import { type NextRequest } from "next/server"
import { analyzeArticle } from "@/lib/analyzer"

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return Response.json({ error: "server error" }, { status: 500 })

  const auth = request.headers.get("authorization")
  const token = auth?.replace("Bearer ", "")

  // Validate API key (Business plan only)
  if (!token || !token.startsWith("cl_api_")) {
    return Response.json({ error: "有効なAPIキーが必要です（Businessプラン）" }, { status: 401 })
  }

  const { article } = await request.json()
  if (!article) return Response.json({ error: "article is required" }, { status: 400 })
  if (article.length < 100) return Response.json({ error: "記事が短すぎます（100文字以上）" }, { status: 400 })

  try {
    const result = await analyzeArticle(article, apiKey)
    return Response.json(result)
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
