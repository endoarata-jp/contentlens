import { type NextRequest } from "next/server"
import { analyzeArticle } from "@/lib/analyzer"

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return Response.json({ error: "サーバー設定エラー" }, { status: 500 })

  const { article } = await request.json()
  if (!article) return Response.json({ error: "記事を入力してください" }, { status: 400 })

  try {
    const result = await analyzeArticle(article, apiKey)
    return Response.json(result)
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
